package com.main.Adopte1API.Controllers;

import com.main.Adopte1API.Utils.BCrypt;
import com.main.Adopte1API.Utils.DB;
import com.main.Adopte1API.Utils.OAuth2Request;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;

@RestController
public class Reddit {

    @GetMapping("/api/reddit/oauth")
    public RedirectView redditOauth2(@RequestParam("code") String code, @RequestParam("state") String email) throws JSONException, SQLException {

        // Front url : https://www.reddit.com/api/v1/authorize?client_id=RPWr-WaGJI3tM39jTlRuvg&redirect_uri=http://localhost:8080/api/reddit/oauth&response_type=code&duration=temporary&scope=identity%20read&state=lepavecmike@gmail.com
        String clientId = "RPWr-WaGJI3tM39jTlRuvg";
        String clientPassword = "3qAZBZGoVwAcCVI7GRMY60YZaEvwCw";

        System.out.println("start oauth");
        String tokenUrl = "https://www.reddit.com/api/v1/access_token";
        OAuth2Request req = new OAuth2Request(tokenUrl, clientId, clientPassword, "http://localhost:8080/api/reddit/oauth");
        req.sendAuthInHeaders("authorization_code", code, "Ubuntu:Dashboard:0.0.1");
        JSONObject res = req.getResult();

        RedirectView redirectView = new RedirectView();
        redirectView.setUrl("http://localhost:8080");
        System.out.println(code);
        System.out.println(res.toString());

        if(res.has("access_token")) {
            String accessToken = res.getString("access_token");
            DB db = new DB();
            db.queryNoResult("UPDATE Users SET RedditAuth = " + DB.escape(accessToken) + " WHERE email = " + DB.escape(email));

            return redirectView;
        }

        return redirectView;
    }

    private static boolean isTokenLegit(String token) {
        try {
            JSONObject threads = OAuth2Request.requestApiReddit("https://oauth.reddit.com/best", token);
            if(threads == null || threads.has("error") && (threads.getInt("error") == 403 || threads.getInt("error") == 401)) {
                return false;
            }
        } catch(JSONException e) {
            return false;
        }

        return true;
    }

    @GetMapping("/api/reddit/getThreads")
    public String getThreads(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }

        String redditToken = OAuth2Request.getOAuthToken("RedditAuth", email, token);

        // verify token here
        if(redditToken == null || !Reddit.isTokenLegit(redditToken)) {
            String redirect = "https://www.reddit.com/api/v1/authorize?client_id=RPWr-WaGJI3tM39jTlRuvg&redirect_uri=http://localhost:8080/api/reddit/oauth&response_type=code&duration=temporary&scope=identity%20read&state=" + email;
            return "{\"error\":\"redirect\", \"url\":\"" + redirect + "\"}";
        }

        JSONObject threads = OAuth2Request.requestApiReddit("https://oauth.reddit.com/best", redditToken);


        return threads.toString();
    }
}
