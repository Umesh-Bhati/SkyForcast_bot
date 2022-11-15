// Requiring modules
var TelegramBot = require("node-telegram-bot-api");
var request = require("request");

// Token obtained from bot father
var token = "5695790873:AAFfk4QmK04wv2DayX3bds4-PPxoHajVU1o";

var bot = new TelegramBot(token, { polling: true });

// Create a bot that uses 'polling' to
// fetch new updates
bot.on("polling_error", (err) => console.log(err));

// The 'msg' is the received Message from user and
// 'match' is the result of execution above
// on the text content
bot.onText(/\/city (.+)/, function (msg, match) {
  // Getting the name of movie from the message
  // sent to bot
  let city = match[1];
  let chatId = msg.chat.id;
  let query =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=5420df5b53fd26ac5a89bc14d86353bb";

  // Key obtained from openweathermap API
  request(query, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      bot
        .sendMessage(chatId, "_Looking for details of_ " + city + "...", {
          parse_mode: "Markdown",
        })
        .then(msg);
      {
        res = JSON.parse(body);
        let temp = Math.round(parseInt(res.main.temp_min) - 273.15, 2);

        // Kelvin to celsius and then round
        // off and conversion to atm
        let pressure = Math.round(parseInt(res.main.pressure) - 1013.15);

        let rise = new Date(parseInt(res.sys.sunrise) * 1000);

        let set = new Date(parseInt(res.sys.sunset) * 1000);

        bot.sendMessage(
          chatId,
          "**** " +
            res.name +
            " ****\nTemperature: " +
            String(temp) +
            "°C\nHumidity: " +
            res.main.humidity +
            " %\nWeather: " +
            res.weather[0].description +
            "\nPressure: " +
            String(pressure) +
            " atm\nSunrise: " +
            rise.toLocaleTimeString() +
            " \nSunset: " +
            set.toLocaleTimeString() +
            "\nCountry: " +
            res.sys.country +
            "\nDeveloper Name: Umesh Bhati\nMy Portfolio Website: https://umeshbhati.netlify.app/ "
        );
      }
    }
  });
});
