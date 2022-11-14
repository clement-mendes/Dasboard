package com.main.Adopte1API.Controllers;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;

@RestController
public class MainController {

	@GetMapping("/about.json")
	public HttpEntity<byte[]> about( HttpServletRequest request) throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json");

		JSONObject result = new JSONObject();

		JSONObject client = new JSONObject();
		client.put("host", request.getRemoteAddr());
		result.put("client", client);

		JSONObject server = new JSONObject();
		server.put("current_time", System.currentTimeMillis());

		JSONArray services = new JSONArray();

		// GOOGLE SERVICE

		JSONObject google = new JSONObject();
		google.put("name", "Google");
		JSONArray googleWidgets = new JSONArray();

		JSONObject googleLogin = new JSONObject();
		googleLogin.put("name", "Login with google");
		googleLogin.put("description", "OAUTH2 login with google service");

		googleLogin.put("params", new JSONArray());

		googleWidgets.put(googleLogin);

		google.put("widgets", googleWidgets);
		services.put(google);

		// REDDIT SERVICE

		JSONObject reddit = new JSONObject();
		reddit.put("name", "Reddit");
		JSONArray redditWidgets = new JSONArray();

		JSONObject redditThreads = new JSONObject();
		redditThreads.put("name", "Reddit threads");
		redditThreads.put("description", "Get your personnal threads listing");

		redditThreads.put("params", new JSONArray());

		redditWidgets.put(redditThreads);

		reddit.put("widgets", redditWidgets);
		services.put(reddit);

		// COINMARKETCAP SERVICE

		JSONObject coinMarketCap = new JSONObject();
		coinMarketCap.put("name", "CoinMarketCap");

		JSONArray coinMarketCapWidgets = new JSONArray();

		// COINMARKETCAPFAVORITE WIDGETS

		JSONObject coinMarketCapFavorite = new JSONObject();
		coinMarketCapFavorite.put("name", "CoinMarketCapFavorite");
		coinMarketCapFavorite.put("description", "Overview of your 5 favorite cryptocurrencies's price");

		JSONArray coinMarketCapFavoriteParams = new JSONArray();

		JSONObject coinMarketCapFavoriteParam = new JSONObject();
		coinMarketCapFavoriteParam.put("name", "Crypto");
		coinMarketCapFavoriteParam.put("type", "string");

		coinMarketCapFavoriteParams.put(coinMarketCapFavoriteParam);
		coinMarketCapFavorite.put("params", coinMarketCapFavoriteParams);


		// COINUNIT WIDGETS

		JSONObject coinUnit = new JSONObject();
		coinUnit.put("name", "CoinUnit");
		coinUnit.put("description", "Find the description of a specific cryptocurrencies");

		JSONArray coinUnitParams = new JSONArray();

		JSONObject coinUnitParam = new JSONObject();
		coinUnitParam.put("name", "Crypto");
		coinUnitParam.put("type", "string");

		coinUnitParams.put(coinUnitParam);
		coinUnit.put("params", coinUnitParams);

		coinMarketCapWidgets.put(coinUnit);
		coinMarketCapWidgets.put(coinMarketCapFavorite);

		coinMarketCap.put("widgets", coinMarketCapWidgets);
		services.put(coinMarketCap);

		// BNET SERVICE

		JSONObject battleNet = new JSONObject();
		battleNet.put("name", "Battle Net");


		JSONArray battleNetWidgets = new JSONArray();

		// AUCTION HOUSE WIDGET

		JSONObject auctionHouse = new JSONObject();
		auctionHouse.put("name", "Auction House");
		auctionHouse.put("description", "Real time World of Warcraft auction house on any realm.");

		JSONArray auctionHouseParams = new JSONArray();

		JSONObject auctionHouseParam = new JSONObject();
		auctionHouseParam.put("name", "realm");
		auctionHouseParam.put("type", "string");

		JSONObject auctionHouseParam2 = new JSONObject();
		auctionHouseParam2.put("name", "objectName");
		auctionHouseParam2.put("type", "string");


		auctionHouseParams.put(auctionHouseParam);
		auctionHouseParams.put(auctionHouseParam2);
		auctionHouse.put("params", auctionHouseParams);

		// MOUNTS WIDGET

		JSONObject mounts = new JSONObject();
		mounts.put("name", "Mounts");
		mounts.put("description", "Display your mounts to your screen and select one to show a render.");
		JSONArray mountsParams = new JSONArray();

		JSONObject mountsParam = new JSONObject();
		mountsParam.put("name", "mount");
		mountsParam.put("type", "string");

		mountsParams.put(mountsParam);
		mounts.put("params", auctionHouseParams);

		battleNetWidgets.put(auctionHouse);
		battleNetWidgets.put(mounts);

		services.put(reddit);
		services.put(coinMarketCap);
		services.put(battleNet);

		// CHARACTERS WIDGET

		JSONObject characters = new JSONObject();
		characters.put("name", "Mounts");
		characters.put("description", "Display your characters information by account and display a rendering on click.");
		JSONArray charactersParams = new JSONArray();

		JSONObject charactersParam = new JSONObject();
		charactersParam.put("name", "account");
		charactersParam.put("type", "integer");

		JSONObject charactersParam2 = new JSONObject();
		charactersParam2.put("name", "character");
		charactersParam2.put("type", "integer");

		charactersParams.put(charactersParam);
		charactersParams.put(charactersParam2);
		characters.put("params", charactersParams);

		battleNetWidgets.put(characters);


		battleNet.put("widgets", battleNetWidgets);

		// SPOTIFY SERVICE

		JSONObject spotify = new JSONObject();
		spotify.put("name", "Spotify");

		JSONArray spotifyWidgets = new JSONArray();

		//SPOTIFY WIDGET

		JSONObject player = new JSONObject();
		player.put("name", "spotify");
		player.put("description", "remote controller for your spotify");
		JSONArray spotifyParams = new JSONArray();

		JSONObject deviceParam = new JSONObject();
		deviceParam.put("name", "device");
		deviceParam.put("type", "String");

		spotifyParams.put(deviceParam);
		player.put("params", spotifyParams);

		spotifyWidgets.put(player);
		spotify.put("widgets", spotifyWidgets);

		services.put(spotify);

		// WEATHER SERVICE

		JSONObject weather = new JSONObject();
		weather.put("name", "weather");

		JSONArray weatherWidgets = new JSONArray();

		//WEATHER WIDGET

		JSONObject city = new JSONObject();
		city.put("name", "city_temperature");
		city.put("description", "Display temperature for a city");
		JSONArray weatherParams = new JSONArray();

		JSONObject cityParam = new JSONObject();
		cityParam.put("name", "city");
		cityParam.put("type", "String");

		weatherParams.put(cityParam);
		city.put("params", weatherParams);

		weatherWidgets.put(city);
		weather.put("widgets", weatherWidgets);

		services.put(weather);

		// LOVE CALCULATOR SERVICE

		JSONObject love = new JSONObject();
		love.put("name", "Love calculator");

		JSONArray loveWidgets = new JSONArray();

		//LOVE CALCULATOR WIDGET

		JSONObject calculator = new JSONObject();
		calculator.put("name", "Love calculator");
		calculator.put("description", "Display the percentage of match between two people");
		JSONArray calculatorParams = new JSONArray();

		JSONObject nameParam = new JSONObject();
		nameParam.put("name", "name");
		nameParam.put("type", "String");

		calculatorParams.put(nameParam);
		calculator.put("params", calculatorParams);

		loveWidgets.put(calculator);
		love.put("widgets", loveWidgets);

		services.put(love);



		server.put("services", services);

		result.put("server", server);

		return new HttpEntity<>(result.toString().getBytes(), headers);
	}

}
