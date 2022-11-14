package com.main.Adopte1API.Controllers;

import com.main.Adopte1API.Utils.BCrypt;
import com.main.Adopte1API.Utils.DB;
import com.main.Adopte1API.Utils.OAuth2Request;
import com.main.Adopte1API.Utils.Strings;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.servlet.view.RedirectView;
import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;
import org.springframework.web.bind.annotation.*;

@RestController

public class Spotify {

    @GetMapping("/api/spotify/getOAuthToken")
    public RedirectView SpotifyOAuth(@RequestParam("code") String code, @RequestParam("state") String email, HttpServletResponse response) throws JSONException, SQLException {
        
        // Front url : https://accounts.spotify.com/authorize?client_id=be5dc17f2a7d474baeb9b585c16f7b0a&redirect_uri=http://localhost:8080/api/spotify/getOAuthToken&response_type=code&scope=user-read-private%20user-read-email%20user-modify-playback-state%20user-read-playback-state&state=clem31100@gmail.com

        String clientId = "be5dc17f2a7d474baeb9b585c16f7b0a";
        String clientPassword = "d0016f0ad2db494991d56f7a193ef7ff";

        String tokenUrl = "https://accounts.spotify.com/api/token";
        OAuth2Request req = new OAuth2Request(tokenUrl, clientId, clientPassword, "http://localhost:8080/api/spotify/getOAuthToken");
        req.send("authorization_code", code);
        JSONObject res = req.getResult();
        RedirectView redirectView = new RedirectView();
        redirectView.setUrl("http://localhost:8080");

        if(res.has("access_token")) {
            String accessToken = res.getString("access_token");
            DB db = new DB();
            db.queryNoResult("UPDATE Users SET SpotifyAuth = " + DB.escape(accessToken) + " WHERE email = " + DB.escape(email));

            return redirectView;
        }

        return redirectView;
    }


    @GetMapping("/api/spotify/devices")
        public String getDevices(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response) throws SQLException, JSONException {
            String email = user.split("::")[0];
            if(!Auth.isLoggedInStatic(token, email)) {
                response.setStatus(401);
                return "{\"error\":\"Not authorized\"}";
            }
            String spotifyToken = OAuth2Request.getOAuthToken("SpotifyAuth", email, token);
            String devicesUrl = "https://api.spotify.com/v1/me/player/devices";
            JSONObject devices = OAuth2Request.requestApiBearer(devicesUrl, spotifyToken);
            if(devices.has("error") || spotifyToken == null) {
                String Redirect = "https://accounts.spotify.com/authorize?client_id=be5dc17f2a7d474baeb9b585c16f7b0a&redirect_uri=http://localhost:8080/api/spotify/getOAuthToken&response_type=code&scope=user-read-private%20user-read-email%20user-modify-playback-state%20user-read-playback-state&state="+email;
                return "{\"error\":\"redirect\", \"url\":\"" + Redirect + "\"}";
            }else{
                    return devices.toString();
                }
            }
        

    @GetMapping("/api/spotify/next")
    public String Next(@CookieValue("user") String user, @CookieValue("AuthToken") String token, @RequestParam("device_id") String device_id, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }
        String spotifyToken = OAuth2Request.getOAuthToken("SpotifyAuth", email, token);
        String nextUrl = "https://api.spotify.com/v1/me/player/next?device_id="+device_id;
        JSONObject next = OAuth2Request.requestApiPOST(nextUrl, spotifyToken);

        if(next.has("error") || spotifyToken == null) {
            String Redirect = "https://accounts.spotify.com/authorize?client_id=be5dc17f2a7d474baeb9b585c16f7b0a&redirect_uri=http://localhost:8080/api/spotify/getOAuthToken&response_type=code&scope=user-read-private%20user-read-email%20user-modify-playback-state%20user-read-playback-state&state="+email;
            return "{\"error\":\"redirect\", \"url\":\"" + Redirect + "\"}";
        }
        return next.toString();
    }

    @GetMapping("/api/spotify/previous")
    public String Previous(@CookieValue("user") String user, @CookieValue("AuthToken") String token, @RequestParam("device_id") String device_id, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }
        String spotifyToken = OAuth2Request.getOAuthToken("SpotifyAuth", email, token);
        String previousUrl = "https://api.spotify.com/v1/me/player/previous?device_id="+device_id;
        JSONObject previous = OAuth2Request.requestApiPOST(previousUrl, spotifyToken);
        if(previous.has("error") || spotifyToken == null) {
            String Redirect = "https://accounts.spotify.com/authorize?client_id=be5dc17f2a7d474baeb9b585c16f7b0a&redirect_uri=http://localhost:8080/api/spotify/getOAuthToken&response_type=code&scope=user-read-private%20user-read-email%20user-modify-playback-state%20user-read-playback-state&state="+email;
            return "{\"error\":\"redirect\", \"url\":\"" + Redirect + "\"}";
        }
        return previous.toString();
    }

    @GetMapping("/api/spotify/icon")
    public String Icon(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }
        String spotifyToken = OAuth2Request.getOAuthToken("SpotifyAuth", email, token);
        String iconUrl = "https://api.spotify.com/v1/me/player/currently-playing";
        JSONObject icon = OAuth2Request.requestApiBearer(iconUrl, spotifyToken);
        if(icon.has("error") || spotifyToken == null) {
            String Redirect = "https://accounts.spotify.com/authorize?client_id=be5dc17f2a7d474baeb9b585c16f7b0a&redirect_uri=http://localhost:8080/api/spotify/getOAuthToken&response_type=code&scope=user-read-private%20user-read-email%20user-modify-playback-state%20user-read-playback-state&state="+email;
            return "{\"error\":\"redirect\", \"url\":\"" + Redirect + "\"}";
        }
        return icon.toString();
        
    }

    @GetMapping("/api/spotify/pause")
    public String Pause(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }
        String spotifyToken = OAuth2Request.getOAuthToken("SpotifyAuth", email, token);
        String pauseUrl = "https://api.spotify.com/v1/me/player/pause";
        JSONObject pause = OAuth2Request.requestApiPUT(pauseUrl, spotifyToken);


        if(pause.has("error") || spotifyToken == null) {
            String Redirect = "https://accounts.spotify.com/authorize?client_id=be5dc17f2a7d474baeb9b585c16f7b0a&redirect_uri=http://localhost:8080/api/spotify/getOAuthToken&response_type=code&scope=user-read-private%20user-read-email%20user-modify-playback-state%20user-read-playback-state&state="+email;
            return "{\"error\":\"redirect\", \"url\":\"" + Redirect + "\"}";
        }
        return pause.toString();
    }

    @GetMapping("/api/spotify/play")
    public String Play(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }
        String spotifyToken = OAuth2Request.getOAuthToken("SpotifyAuth", email, token);
        String playUrl = "https://api.spotify.com/v1/me/player/play";
        JSONObject play = OAuth2Request.requestApiPUT(playUrl, spotifyToken);

        if(play.has("error") || spotifyToken == null) {
            String Redirect = "https://accounts.spotify.com/authorize?client_id=be5dc17f2a7d474baeb9b585c16f7b0a&redirect_uri=http://localhost:8080/api/spotify/getOAuthToken&response_type=code&scope=user-read-private%20user-read-email%20user-modify-playback-state%20user-read-playback-state&state="+email;
            return "{\"error\":\"redirect\", \"url\":\"" + Redirect + "\"}";
        }
        return play.toString();
    }


}
