package com.main.Adopte1API.Controllers;

import com.main.Adopte1API.Utils.DB;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;
import java.util.Collection;

@RestController
public class Dashboard {

    @GetMapping("/api/dashboard/getWidgets")
    public Object getWidgets(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response) throws SQLException, JSONException {

        response.setContentType("json");

        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }
        DB db = new DB();
        JSONArray res = db.query("SELECT widgets FROM Users WHERE email = " + DB.escape(email));
        JSONObject result = res.getJSONObject(0);
        return result.toString();
    }

    @PutMapping("/api/dashboard/setWidget")
    public Object setWidget(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response, @RequestParam("index") int index, @RequestParam("data") String data) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }


        DB db = new DB();
        JSONArray res = db.query("SELECT widgets FROM Users WHERE email = " + DB.escape(email));

        JSONArray widgets = res.getJSONArray(0);
        if(widgets.length() < index) {
            response.setStatus(400);
            return "{\"error\":\"No widget like that\"}";
        }

        JSONObject newValue = new JSONObject(data);
        JSONObject widget = widgets.getJSONObject(index);

        if(widget.equals(newValue)) {
            return true;
        }

        widgets.put(index, newValue);

        db.queryNoResult("UPDATE Users SET widgets="+DB.escape(widgets.toString()) + " WHERE email = " + DB.escape(email));

        return true;
    }

    @PutMapping("/api/dashboard/setWidgets")
    public Object setWidgets(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response, @RequestParam("data") String data) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }


        DB db = new DB();

        db.queryNoResult("UPDATE Users SET widgets="+DB.escape(new JSONArray(data).toString()) + " WHERE email = " + DB.escape(email));

        return true;
    }

    @PostMapping("/api/dashboard/addWidget")
    public Object addWidget(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response, @RequestParam("data") String data) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }


        DB db = new DB();
        JSONArray res = db.query("SELECT widgets FROM Users WHERE email = " + DB.escape(email));
        JSONArray widgets;
        try {
            widgets = new JSONArray(res.getJSONObject(0).getString("widgets"));
        } catch (JSONException e) {
            widgets = new JSONArray();
        }

        widgets.put(new JSONObject(data));

        db.queryNoResult("UPDATE Users SET widgets="+DB.escape(widgets.toString()) + " WHERE email = " + DB.escape(email));

        return true;
    }

    @DeleteMapping("/api/dashboard/deleteWidget")
    public Object deleteWidget(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response, @RequestParam("index") int index) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }


        DB db = new DB();
        JSONArray res = db.query("SELECT widgets FROM Users WHERE email = " + DB.escape(email));
        JSONArray widgets = new JSONArray(res.getJSONObject(0).getString("widgets"));
        JSONArray result = new JSONArray();
        for(int i = 0; i < widgets.length(); i++) {
            if(i != index) {
                result.put(widgets.getJSONObject(i));
            }
        }

        db.queryNoResult("UPDATE Users SET widgets="+DB.escape(result.toString()) + " WHERE email = " + DB.escape(email));

        return true;
    }
}
