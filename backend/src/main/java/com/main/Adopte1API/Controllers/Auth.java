package com.main.Adopte1API.Controllers;

import com.main.Adopte1API.Models.User;
import com.main.Adopte1API.Utils.BCrypt;
import com.main.Adopte1API.Utils.DB;
import com.main.Adopte1API.Utils.Validations;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;

@RestController
@CrossOrigin
public class Auth {
    private User user;

    @GetMapping("/api/Auth/Logout")
    public boolean logout(HttpServletResponse response) {
        response.addHeader("Set-Cookie", "AuthToken=0;Path=/;SameSite=Strict;HttpOnly;expires=Tue, 1 Nov 2022 16:04:58 GMT");

        response.addHeader("Set-Cookie", "user=0;Path=/;SameSite=Strict;HttpOnly;expires=Tue, 1 Nov 2022 16:04:58 GMT");

        return true;
    }

    public static boolean isLoggedInStatic(String token, String email) throws SQLException, JSONException {

        if(token == null || email == null || token.isEmpty() || email.isEmpty()) {
            return false;
        }


        DB db = new DB();
        JSONArray User = db.query("SELECT * FROM Users WHERE email = " + DB.escape(email));

        if(User.length() == 0) {
            return false;
        }

        String password;

        if(User.getJSONObject(0).has("password")) {
            password = User.getJSONObject(0).getString("password");
        }

        else if(User.getJSONObject(0).has("GoogleAuth")) {
            password = User.getJSONObject(0).getString("GoogleAuth");
        }

        else {
            return false;
        }

        JSONObject tokenObj = new JSONObject();
        tokenObj.put("email", email);
        tokenObj.put("password", password);

        if(BCrypt.checkpw(tokenObj.toString(), token)) {
            return true;
        }

        return false;
    }

    @GetMapping("/api/Auth/isLoggedIn")
    public boolean isLoggedIn(@CookieValue("AuthToken") String token, @CookieValue("user") String user) throws SQLException, JSONException {

        String email = user.split("::")[0];
        return Auth.isLoggedInStatic(token, email);
    }
    @PostMapping("/api/Auth/Login")
    public String login(@RequestBody String body, HttpServletResponse response) throws JSONException, SQLException {
        JSONObject req = new JSONObject(body);
        String password = req.getString("password");
        String email = req.getString("email");
        DB db = new DB();
        JSONArray user = db.query("SELECT * FROM Users WHERE email = " + DB.escape(email));
        if(user.length() == 0) {
            return "{\"error\":\"Wrong credentials\"}";
        }
        JSONObject userObject = user.getJSONObject(0);
        if (BCrypt.checkpw(password, userObject.getString("password"))) {
            JSONObject tokenObj = new JSONObject();
            tokenObj.put("email", email);
            tokenObj.put("password", userObject.getString("password"));
            String token = BCrypt.hashpw(tokenObj.toString(), BCrypt.gensalt());
            response.addHeader("Set-Cookie", "AuthToken="+token+";Path=/;SameSite=Strict;HttpOnly");

            response.addHeader("Set-Cookie", "user="+email+"::"+ userObject.getString("first_name")+"::"+ userObject.getString("last_name")+";Path=/;SameSite=Strict");

            JSONObject userData = new JSONObject();
            userData.put("last_name", userObject.getString("last_name").replaceAll(" ", "%20"));
            userData.put("first_name", userObject.getString("first_name").replaceAll(" ", "%20"));
            userData.put("email", userObject.getString("email"));
            return "{\"success\":"+userData.toString()+"}";
        }

        return "{\"error\":\"Wrong credentials\"}";

    }

    @PostMapping("/api/Auth/Register")
    public String register(@RequestBody String body) throws JSONException, SQLException {
        JSONObject req = new JSONObject(body);

        String email = req.getString("email");
        if(!Validations.isEmail(email)) {
            return "{'error':'Please enter a valid email'}";
        }
        String password = req.getString("password");
        String firstName = req.getString("firstName");
        String lastName = req.getString("lastName");
        if(firstName.isEmpty() || firstName.isBlank() || lastName.isEmpty() || lastName.isBlank() || password.isEmpty() || password.isBlank()) {
            return "{'error':'Please fill every fields'}";
        }

        String hash = BCrypt.hashpw(password, BCrypt.gensalt());

        DB db = new DB();

        db.queryNoResult("INSERT INTO Users (email, password, first_name, last_name, widgets) VALUES (" +
                DB.escape(email) + ", " + DB.escape(hash)  + ", " + DB.escape(firstName) + ", " + DB.escape(lastName) +", '[]')");

        return "{'success':'Successfully created your account'}";
    }
}
