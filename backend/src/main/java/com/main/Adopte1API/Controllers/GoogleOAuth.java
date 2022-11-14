package com.main.Adopte1API.Controllers;

import com.main.Adopte1API.Utils.BCrypt;
import com.main.Adopte1API.Utils.DB;
import com.main.Adopte1API.Utils.OAuth2Request;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;

@RestController
public class GoogleOAuth {

    @GetMapping("/api/Google/OAuth")
    public RedirectView GoogleOAuth(@RequestParam("code") String code, HttpServletResponse response) throws JSONException, SQLException {

        String clientId = "990236761136-d436uvvjeousdbgil3r7cs706no819h0.apps.googleusercontent.com";
        String clientPassword = "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";

        String tokenUrl = "https://oauth2.googleapis.com/token";
        OAuth2Request req = new OAuth2Request(tokenUrl, clientId, clientPassword, "http://localhost:8080/api/Google/OAuth");
        req.send("authorization_code", code);
        JSONObject res = req.getResult();


        DB db = new DB();
        JSONObject user = OAuth2Request.requestApi("https://www.googleapis.com/oauth2/v2/userinfo?", res.getString("access_token"));

        String email = user.getString("email");
        String lastName = user.getString("family_name");
        String firstName = user.getString("given_name");

        JSONArray ourUsers = db.query("SELECT * FROM Users WHERE email=" + DB.escape(email));

        RedirectView redirectView = new RedirectView();
        redirectView.setUrl("http://localhost:8080?user="+email+"::"+ firstName.replaceAll(" ", "%20")+"::"+ lastName.replaceAll(" ", "%20"));

        JSONObject tokenObj = new JSONObject();
        tokenObj.put("email", email);

        tokenObj.put("password", res.getString("access_token"));

        String token = BCrypt.hashpw(tokenObj.toString(), BCrypt.gensalt());

        response.addHeader("Set-Cookie", "AuthToken=" + token + ";Path=/;SameSite=Strict;HttpOnly");

        if(ourUsers.length() > 0) {
            if(ourUsers.getJSONObject(0).getString("GoogleAuth") != res.getString("access_token")) {
                db.queryNoResult("UPDATE Users SET GoogleAuth="+DB.escape(res.getString("access_token")) + " WHERE email = " + DB.escape(email));
            }
            return redirectView;
        }
        db.queryNoResult("INSERT INTO Users (email, last_name, first_name, GoogleAuth, widgets) VALUES (" + DB.escape(email) + ", " + DB.escape(lastName) + ", " + DB.escape(firstName) + ", " + DB.escape(res.getString("access_token")) + ", '[]')");

        return redirectView;
    }

}
