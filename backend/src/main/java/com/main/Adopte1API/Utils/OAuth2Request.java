package com.main.Adopte1API.Utils;

import com.main.Adopte1API.Controllers.Auth;
import org.apache.tomcat.util.codec.binary.Base64;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.SQLException;

public class OAuth2Request {
    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    private String login;
    private String password;
    private String url;
    private String redirectUri;

    public JSONObject getResult() {
        return result;
    }

    private JSONObject result;


    public OAuth2Request(String url) {
        this.url = url;
    }

    public OAuth2Request(String url, String login, String password, String redirectUri) {
        this.url = url;
        this.login = login;
        this.password = password;
        this.redirectUri = redirectUri;
    }

    public static String getOAuthToken(String widget, String email, String authToken) throws SQLException, JSONException {
        if(!Auth.isLoggedInStatic(authToken, email)) {
            return "{'error': 'Forbidden'}";
        }
        DB db = new DB();
        JSONArray result = db.query("SELECT " + widget + " FROM Users WHERE email = " + DB.escape(email));

        if(result.length() == 0 || result == null || result.toString().equals("[{}]")) {
            return null;
        }

        String userToken = result.getJSONObject(0).getString(widget);



        return userToken;

    }



    public void send(String grant_type, String code) {
        try {
            ProcessBuilder pb = new ProcessBuilder("curl", "-X", "POST",  "--data", "redirect_uri="+ this.redirectUri, "--data", "client_id="+this.login, "--data", "client_secret="+this.password, "--data", "grant_type="+grant_type, "--data", "code="+code, this.url);
            Process process = pb.start();
            InputStream response = process.getInputStream();
            BufferedReader read = new BufferedReader(new InputStreamReader(response));
            StringBuilder sb = new StringBuilder();

            read.lines().forEach(sb::append);

            read.close();
            process.waitFor();
            this.result = new JSONObject(sb.toString());
            process.destroy();
        } catch (IOException e) {
            System.out.println(e.getMessage());
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendAuthInHeaders(String grant_type, String code, String userAgent) {
        try {
            ProcessBuilder pb = new ProcessBuilder("curl", "-X", "POST", "-H", "User-Agent: "+ userAgent,  "--data", "redirect_uri="+ this.redirectUri, "--user", this.login + ":" + this.password, "--data", "grant_type="+grant_type, "--data", "code="+code, this.url);

            Process process = pb.start();
            InputStream response = process.getInputStream();
            BufferedReader read = new BufferedReader(new InputStreamReader(response));
            StringBuilder sb = new StringBuilder();

            read.lines().forEach(sb::append);

            read.close();
            process.waitFor();
            this.result = new JSONObject(sb.toString());
            process.destroy();
        } catch (IOException e) {
            System.out.println(e.getMessage());
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }


    public static JSONObject requestApi(String url, String token) {
        try {
            ProcessBuilder pb = new ProcessBuilder("curl", url+"&access_token=" + token);
            Process process = pb.start();
            InputStream response = process.getInputStream();
            BufferedReader read = new BufferedReader(new InputStreamReader(response));
            StringBuilder sb = new StringBuilder();

            read.lines().forEach(sb::append);
            read.close();
            process.waitFor();
            process.destroy();
            if(sb.toString().isEmpty() || !sb.toString().startsWith("{") || !sb.toString().endsWith("}")) {
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

    public static JSONObject requestApiBearer(String url, String token) {
        try {
            ProcessBuilder pb = new ProcessBuilder("curl", url, "-H", "Accept: application/json", "-H", "Content-Type: application/json", "-H", "Authorization: Bearer " + token);
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

    public static JSONObject requestApiPOST(String url, String token) {
        try {
            ProcessBuilder pb = new ProcessBuilder("curl", "-X", "POST", url, "-H", "Accept: application/json", "-H", "Content-Type: application/json", "-H", "Authorization: Bearer " + token, "-d", "\"\"");
            Process process = pb.start();
            InputStream response = process.getInputStream();
            BufferedReader read = new BufferedReader(new InputStreamReader(response));
            StringBuilder sb = new StringBuilder();

            read.lines().forEach(sb::append);
            read.close();
            process.waitFor();
            process.destroy();
            if(sb.toString().isEmpty()) {
                return new JSONObject();
                
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

    public static JSONObject requestApiPUT(String url, String token) {
        try {
            ProcessBuilder pb = new ProcessBuilder("curl",  "-X",  "PUT", url, "-H", "Accept: application/json", "-H", "Content-Type: application/json", "-H", "Authorization: Bearer "+ token, "-d", "{}");
            Process process = pb.start();
            InputStream response = process.getInputStream();
            BufferedReader read = new BufferedReader(new InputStreamReader(response));
            StringBuilder sb = new StringBuilder();

            read.lines().forEach(sb::append);
            read.close();
            process.waitFor();
            process.destroy();

            if(sb.toString().isEmpty()) {
                return new JSONObject();
                
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

    public static JSONObject requestApiMeteo(String url) {
        try {
            ProcessBuilder pb = new ProcessBuilder("curl", url);
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

    public static JSONObject requestApiReddit(String url, String token) {
        try {
            ProcessBuilder pb = new ProcessBuilder("curl", url,  "-H", "User-Agent: Ubuntu:Dashboard:0.0.1", "-H", "Accept: application/json", "-H", "Content-Type: application/json", "-H", "Authorization: bearer " + token);
            Process process = pb.start();
            InputStream response = process.getInputStream();
            BufferedReader read = new BufferedReader(new InputStreamReader(response));
            StringBuilder sb = new StringBuilder();

            read.lines().forEach(sb::append);
            read.close();
            process.waitFor();
            process.destroy();

            if(sb.toString().isEmpty() || !sb.toString().startsWith("{") || !sb.toString().endsWith("}")) {
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

    public static JSONObject requestApiLove(String url) {
        try {
            ProcessBuilder pb = new ProcessBuilder("curl", url,"-H","X-RapidAPI-Key: 66c2402fd8msh50e0a8613b0ab09p11c595jsne6f2ff6ff5bc", "-H", "X-RapidAPI-Host: love-calculator.p.rapidapi.com");
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

}
