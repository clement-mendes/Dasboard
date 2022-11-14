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


public class Love {
    

    @GetMapping("/api/love/percentage")
    public String getCity(@CookieValue("user") String user, @RequestParam("sname") String sname, @RequestParam("fname") String fname, @CookieValue("AuthToken") String token, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }
        String percentageUrl = "https://love-calculator.p.rapidapi.com/getPercentage?sname="+sname+"&fname="+fname;
        JSONObject percentage = OAuth2Request.requestApiLove(percentageUrl);
        
                return percentage.toString();
            
    }
}
