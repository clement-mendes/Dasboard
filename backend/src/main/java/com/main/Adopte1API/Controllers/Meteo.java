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

public class Meteo {

    @GetMapping("/api/meteo/city")
    public String getCity(@CookieValue("user") String user, @RequestParam("ville") String ville, @CookieValue("AuthToken") String token, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }
        String cityUrl = "http://api.openweathermap.org/data/2.5/weather?q="+ville+"&appid=26f9918b341290ff4ca904116176a0f2";
        JSONObject city = OAuth2Request.requestApiMeteo(cityUrl);
        
                return city.toString();
            
    }

    // @GetMapping("/api/meteo/weather")
    // public String Weather(@CookieValue("user") String user, @RequestParam("insee") String insee, @CookieValue("AuthToken") String token, HttpServletResponse response) throws SQLException, JSONException {
    //     String email = user.split("::")[0];
    //     if(!Auth.isLoggedInStatic(token, email)) {
    //         response.setStatus(401);
    //         return "{\"error\":\"Not authorized\"}";
    //     }
    //     String weatherUrl = "https://api.meteo-concept.com/api/forecast/daily?token=e5309e3e07a78ebc121b71946a8dc235feb71d20613252b205281f08f71ddbbf&insee="+insee;
    //     JSONObject weather = OAuth2Request.requestApiMeteo(weatherUrl);
        
    //             return weather.toString();
            
    // }
}
