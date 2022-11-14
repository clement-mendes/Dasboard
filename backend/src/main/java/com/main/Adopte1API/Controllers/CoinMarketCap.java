package com.main.Adopte1API.Controllers;

import com.main.Adopte1API.Controllers.Auth;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONString;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.SQLException;

import javax.servlet.http.HttpServletResponse;

@RestController
public class CoinMarketCap{ 

    public static JSONObject requestApi(String url, String token) {
        try {
            ProcessBuilder pb = new ProcessBuilder("curl", "-H", "X-CMC_PRO_API_KEY: " + token, url);
            Process process = pb.start();
            InputStream response = process.getInputStream();
            BufferedReader read = new BufferedReader(new InputStreamReader(response));
            StringBuilder sb = new StringBuilder();

            read.lines().forEach(sb::append);
            read.close();
            process.waitFor();
            process.destroy();
            if(sb.toString().isEmpty()) {
                return null;
            }
            return new JSONObject(sb.toString());
        } catch (IOException e) {
            System.out.println(e.getMessage());
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @GetMapping("/api/coinmarketcap/getId")
    public Object getId(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }
        String apiKey = "a11f91ef-87ae-469d-97f1-b50ab207ec4d";

        JSONObject data = CoinMarketCap.requestApi("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", apiKey);
        Integer cryptoId = data.getJSONArray("data").getJSONObject(0).getInt("id");

        return data.toString();
    }

    @GetMapping("/api/coinmarketcap/getPrice")
    public Object getData(@CookieValue("user") String user, @CookieValue("AuthToken") String token, @RequestParam("slug") String slug, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }
        String apiKey = "a11f91ef-87ae-469d-97f1-b50ab207ec4d";

        JSONObject data = CoinMarketCap.requestApi("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest/items?slug="+ slug, apiKey);
        
        //Double price = data.getJSONArray("data").getJSONObject(0).getJSONObject("quote").getJSONObject("USD").getDouble("price");

        return data.toString();
    }
    
        @GetMapping("/api/coinmarketcap/getLogo")
        public Object getLogo(@CookieValue("user") String user, @CookieValue("AuthToken") String token, @RequestParam("cryptoId") Integer cryptoId, HttpServletResponse response) throws SQLException, JSONException {
            String email = user.split("::")[0];
            if(!Auth.isLoggedInStatic(token, email)) {
                response.setStatus(401);
                return "{\"error\":\"Not authorized\"}";
            }
            String apiKey = "a11f91ef-87ae-469d-97f1-b50ab207ec4d";

            JSONObject data = CoinMarketCap.requestApi("https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id="+ cryptoId.toString(), apiKey);
            

            //String logo = data.getJSONArray("data").getJSONObject(0).getJSONObject("quote").getJSONObject("USD").getString("price");
    
            return data.toString();
    }
}