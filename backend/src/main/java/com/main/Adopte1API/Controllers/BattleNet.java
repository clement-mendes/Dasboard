package com.main.Adopte1API.Controllers;

import com.main.Adopte1API.Utils.DB;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;
import com.main.Adopte1API.Utils.OAuth2Request;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
public class BattleNet {

    @GetMapping("/api/battlenet/getOAuthToken")
    public RedirectView getOAuthToken(@RequestParam("code") String code, @RequestParam("state") String email) throws JSONException, SQLException {


        // Front url : https://oauth.battle.net/authorize?client_id=26add33896a44c388f5fa6c9efedc6a3&redirect_uri=http://localhost:8080/api/battlenet/getOAuthToken&response_type=code&scope=wow.profile&state=lepavecmike@gmail.com
        String clientId = "26add33896a44c388f5fa6c9efedc6a3";
        String clientPassword = "XocvTmvuBmvi48lssU53XMxgDJw2x4PY";


        String tokenUrl = "https://oauth.battle.net/token";
        OAuth2Request req = new OAuth2Request(tokenUrl, clientId, clientPassword, "http://localhost:8080/api/battlenet/getOAuthToken");
        req.send("authorization_code", code);
        JSONObject res = req.getResult();

        RedirectView redirectView = new RedirectView();
        redirectView.setUrl("http://localhost:8080");

        if(res.has("access_token")) {
            String accessToken = res.getString("access_token");
            DB db = new DB();
            db.queryNoResult("UPDATE Users SET BattleNetAuth = " + DB.escape(accessToken) + " WHERE email = " + DB.escape(email));

            return redirectView;
        }

        return redirectView;
    }

    private boolean verifyToken(String email, String bnetToken) throws SQLException, JSONException {
        String url = "https://oauth.battle.net/oauth/check_token?region=eu&token="+bnetToken;


        JSONObject isTokenLegit = OAuth2Request.requestApi(url, bnetToken);

        if(isTokenLegit == null || isTokenLegit.has("error")) {
            return false;
        }

        boolean res = false;
        for(int i = 0; i < isTokenLegit.getJSONArray("scope").length(); i++) {
            if(isTokenLegit.getJSONArray("scope").getString(i).equals("wow.profile")) {
                res = true;
            }
        }
        return res;
    }
    @GetMapping("/api/battlnet/getEveryAuctions")
    public String getEveryAuctions(@CookieValue("user") String user, @CookieValue("AuthToken") String token, @RequestParam("realmId") String realmId, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }

        String bnetToken = OAuth2Request.getOAuthToken("BattleNetAuth", email, token);


        if(!this.verifyToken(email, bnetToken)) {
            String redirect = "https://oauth.battle.net/authorize?client_id=26add33896a44c388f5fa6c9efedc6a3&redirect_uri=http://localhost:8080/api/battlenet/getOAuthToken&response_type=code&scope=wow.profile&state=" + email;
            return "{\"error\":\"redirect\", \"url\":\"" + redirect + "\"}";
        }

        JSONArray result = new JSONArray();
        JSONObject request = OAuth2Request.requestApi("https://eu.api.blizzard.com/data/wow/connected-realm/"+realmId+"/auctions?namespace=dynamic-eu&locale=fr_FR", bnetToken);
        
        JSONArray auctions = request.getJSONArray("auctions");
        Map<String, JSONObject> knownItems = new HashMap<>();

        int n = 5;

        if(auctions.length() < n) {
            n = auctions.length();
        }

        for(int i = 0; i < n; i++) {
            String id = auctions.getJSONObject(i).getJSONObject("item").getString("id");
            if(knownItems.containsKey(id)) {
                result.put(knownItems.get(id));
                continue;
            }

            JSONObject item = OAuth2Request.requestApi("https://eu.api.blizzard.com/data/wow/item/"+id+"?namespace=static-eu&locale=fr_FR", bnetToken);

            JSONObject payload = new JSONObject();
            payload.put("id", id);
            payload.put("name", item.getString("name"));
            payload.put("media", item.getJSONObject("media").getJSONObject("key").getString("href") + "&access_token="+bnetToken);
            payload.put("rarity", item.getJSONObject("quality").getString("name"));
            payload.put("type", item.getJSONObject("item_class").getString("name"));
            payload.put("subtype", item.getJSONObject("item_subclass").getString("name"));
            payload.put("price", auctions.getJSONObject(i).getString("buyout"));
            knownItems.put(id, payload);

            result.put(payload);
        }

        return result.toString();
    }
    @GetMapping("/api/battlenet/getEveryRealms")
    public String getEveryRealms(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if(!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }

        String bnetToken = OAuth2Request.getOAuthToken("BattleNetAuth", email, token);

        if(bnetToken == null || !this.verifyToken(email, bnetToken)) {
            String redirect = "https://oauth.battle.net/authorize?client_id=26add33896a44c388f5fa6c9efedc6a3&redirect_uri=http://localhost:8080/api/battlenet/getOAuthToken&response_type=code&scope=wow.profile&state=" + email;
            return "{\"error\":\"redirect\", \"url\":\"" + redirect + "\"}";
        }

        JSONArray result = new JSONArray();
        JSONObject realms = OAuth2Request.requestApi("https://eu.api.blizzard.com/data/wow/connected-realm/index?namespace=dynamic-eu&locale=fr_FR", bnetToken);
        JSONArray connectedRealms = realms.getJSONArray("connected_realms");
        for(int i = 0; i < connectedRealms.length() - 90; i++) {
            String href = connectedRealms.getJSONObject(i).getString("href");
            JSONObject realmInfo = OAuth2Request.requestApi(href, bnetToken);
            JSONObject payload = new JSONObject();
            payload.put("href", href);
            payload.put("name", realmInfo.getJSONArray("realms").getJSONObject(0).getJSONObject("name").getString("fr_FR"));
            payload.put("id", realmInfo.getString("id"));
            result.put(payload);
        }

        return result.toString();
    }

    @GetMapping("/api/battlenet/getMounts")
    public String getMounts(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if (!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }

        String bnetToken = OAuth2Request.getOAuthToken("BattleNetAuth", email, token);

        if (bnetToken == null || !this.verifyToken(email, bnetToken)) {
            String redirect = "https://oauth.battle.net/authorize?client_id=26add33896a44c388f5fa6c9efedc6a3&redirect_uri=http://localhost:8080/api/battlenet/getOAuthToken&response_type=code&scope=wow.profile&state=" + email;
            return "{\"error\":\"redirect\", \"url\":\"" + redirect + "\"}";
        }

        JSONObject mounts = OAuth2Request.requestApi("https://eu.api.blizzard.com/profile/user/wow/collections/mounts?namespace=profile-eu&locale=fr_FR", bnetToken);

        if(mounts == null) {
            response.setStatus(400);
            return null;
        }
        mounts.put("token", bnetToken);
        return mounts.toString();
    }

    @GetMapping("/api/battlenet/getCharacters")
    public String getCharacters(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if (!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }

        String bnetToken = OAuth2Request.getOAuthToken("BattleNetAuth", email, token);

        if (bnetToken == null || !this.verifyToken(email, bnetToken)) {
            String redirect = "https://oauth.battle.net/authorize?client_id=26add33896a44c388f5fa6c9efedc6a3&redirect_uri=http://localhost:8080/api/battlenet/getOAuthToken&response_type=code&scope=wow.profile&state=" + email;
            return "{\"error\":\"redirect\", \"url\":\"" + redirect + "\"}";
        }


        // https://eu.api.blizzard.com/profile/user/wow?namespace=profile-eu&locale=fr_FR&access_token=EUv1tqe8aA641qEz9pDY5AJeOm6F6mhZLE

        JSONObject characters = OAuth2Request.requestApi("https://eu.api.blizzard.com/profile/user/wow?namespace=profile-eu&locale=fr_FR", bnetToken);

        if(characters == null) {
            response.setStatus(400);
            return null;
        }

        characters.put("accessToken", bnetToken);

        return characters.toString();
    }

    @GetMapping("/api/battlenet/getCharacter")
    public String getCharacter(@CookieValue("user") String user, @CookieValue("AuthToken") String token, HttpServletResponse response, @RequestParam("id") String id) throws SQLException, JSONException {
        String email = user.split("::")[0];
        if (!Auth.isLoggedInStatic(token, email)) {
            response.setStatus(401);
            return "{\"error\":\"Not authorized\"}";
        }

        String bnetToken = OAuth2Request.getOAuthToken("BattleNetAuth", email, token);

        if (bnetToken == null || !this.verifyToken(email, bnetToken)) {
            String redirect = "https://oauth.battle.net/authorize?client_id=26add33896a44c388f5fa6c9efedc6a3&redirect_uri=http://localhost:8080/api/battlenet/getOAuthToken&response_type=code&scope=wow.profile&state=" + email;
            return "{\"error\":\"redirect\", \"url\":\"" + redirect + "\"}";
        }


        // https://eu.api.blizzard.com/profile/user/wow?namespace=profile-eu&locale=fr_FR&access_token=EUv1tqe8aA641qEz9pDY5AJeOm6F6mhZLE

        JSONObject characters = OAuth2Request.requestApi("https://eu.api.blizzard.com/profile/user/wow?namespace=profile-eu&locale=fr_FR", bnetToken);

        if(characters == null) {
            response.setStatus(400);
            return null;
        }


        System.out.println("ca marche");

        return characters.toString();
    }
}
