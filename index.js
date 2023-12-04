import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";
import fs from "fs";

//JSON Files
  /**
   * Language
   */
  let enJSON = JSON.parse(fs.readFileSync("language/en.json"));
  let trJSON = JSON.parse(fs.readFileSync("language/tr.json"));
  let frJSON = JSON.parse(fs.readFileSync("language/fr.json"));
  let deJSON = JSON.parse(fs.readFileSync("language/de.json"));
  let jaJSON = JSON.parse(fs.readFileSync("language/ja.json"));
  /**
   * Units
   */
  let imperialJSON = JSON.parse(fs.readFileSync("units/imperial.json"));
  let metricJSON = JSON.parse(fs.readFileSync("units/metric.json"));
  let standardJSON = JSON.parse(fs.readFileSync("units/standard.json"));


//API Values
  const API_KEY = process.env.API_KEY;
  const API_URL = "https://api.openweathermap.org/data/3.0/onecall?";
  const API_CITY_URL = "http://api.openweathermap.org/geo/1.0/direct?";
  let cityLoc;
  let cityName;
  let weatherData;
  let unitsJSON = metricJSON;
  let langJSON = enJSON;

//Date values
  let currentDate = new Date();
  let currentHour = currentDate.getHours();
  let hour = currentDate.toLocaleTimeString([], {hour: '2-digit',minute:'2-digit'});
  let today = currentDate.toLocaleDateString([], {day: '2-digit',month:'2-digit'});
  let tomorrow = AddDays(currentDate,1);
  const tonight =Math.abs(24 - currentHour);
  const tonightTomorrow = Math.abs(48 - currentHour);

  let unix_timestamp_sun_rise;
  let unix_timestamp_sun_set;
  let sunrise
  let sunset

  let unix_timestamp_moon_rise;
  let unix_timestamp_moon_set;
  let moonrise
  let moonset

//Express and Middleware
  const app = express();
  const port = 3000;
  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set("view engine", "ejs");

//Get Requests
  app.get("/", (req,res) =>{
    res.render("index"); 
  })

// Post Requests
  app.post("/location", async (req,res) => {
    cityName = req.body.city_name
    MakeRequest(res,"location");
  })

  app.post("/pref", async (req,res) => {
    var path = req.body.page;
    if(path === "details"){
      path = "details";
    }else{
      path = "location";
    }
    ChangeUnit(req.body.userUnit);
    ChangeLanguage(req.body.userLang); 
    MakeRequest(res,`${path}`);
  })
  app.post("/details", (req,res) => {
    CalculateRiseSet(0);
    
    res.render("details",{

      city: cityLoc.data[0],
      data_current: weatherData.data.current,
      data_today: weatherData.data.daily[0],
      data_tonight: weatherData.data.hourly[tonight],

      today:today,
      sunrise:sunrise,
      sunset:sunset,
      moonrise:moonrise,
      moonset:moonset,

      units:unitsJSON.unit_name,
      language: langJSON,
      unit_symbols: unitsJSON

      });
      
  })
  app.post("/tomorrow", (req,res) => {
    CalculateRiseSet(1);

    res.render("details", {

      city: cityLoc.data[0],
      data_current: weatherData.data.current,
      data_today: weatherData.data.daily[1],
      data_tonight: weatherData.data.hourly[tonightTomorrow],

      today:tomorrow,
      sunrise:sunrise,
      sunset:sunset,
      moonrise:moonrise,
      moonset:moonset,

      units:unitsJSON.unit_name,
      language: langJSON,
      unit_symbols: unitsJSON

    });
  })
  app.post("/home", (req,res) => {
    res.render("location", {
      city: cityLoc.data[0],
      data_current: weatherData.data.current,
      data_today: weatherData.data.daily[1],
      data_tomorrow: weatherData.data.daily[1],
      data_tonight: weatherData.data.hourly[tonightTomorrow],

      tomorrow: tomorrow,
      today:today,
      hour:hour,

      units:unitsJSON.unit_name,
      language: langJSON,
      unit_symbols: unitsJSON
    });
  })

function CalculateRiseSet(index) {
  unix_timestamp_sun_rise = weatherData.data.daily[index].sunrise;
  unix_timestamp_sun_set = weatherData.data.daily[index].sunset;
  unix_timestamp_moon_rise = weatherData.data.daily[index].moonrise;
  unix_timestamp_moon_set = weatherData.data.daily[index].moonset;

  sunrise = new Date(unix_timestamp_sun_rise * 1000);
  sunset = new Date(unix_timestamp_sun_set * 1000);
  moonrise = new Date(unix_timestamp_moon_rise * 1000);
  moonset = new Date(unix_timestamp_moon_set * 1000);
}

// Refactor Functions
  function ChangeLanguage(clientLanguage) {
    if(clientLanguage){
      switch (clientLanguage) {
        case "en":
          langJSON = enJSON;
          break;
        case "tr":
          langJSON = trJSON;
          break;
        case "fr":
          langJSON = frJSON;
          break;
        case "de":
          langJSON = deJSON;
          break;
        case "ja":
          langJSON = jaJSON;
          break;
        default:
          break;
      }
    }
  }
  function ChangeUnit(clientUnit) {
    if(clientUnit){
      switch (clientUnit) {
        case "imperial":
          unitsJSON = imperialJSON;
          break;
        case "metric":
          unitsJSON = metricJSON;
          break;
        case "standard":
          unitsJSON = standardJSON;
          break;
        default:
          break;
      }
    }
  }
  async function MakeRequest(res,URL) {
    try {
      cityLoc = await axios.get(
        API_CITY_URL + `q=${cityName}&limit=5&appid=${API_KEY}`
      );
      const latitude = cityLoc.data[0].lat;
      const longitude = cityLoc.data[0].lon;
      weatherData = await axios.get(
        API_URL +
          `lat=${latitude}&lon=${longitude}&lang=${langJSON.language_name}&units=${unitsJSON.unit_name}&appid=${API_KEY}`
      );
      res.render(URL, {

        city: cityLoc.data[0],
        data_current: weatherData.data.current,
        data_today: weatherData.data.daily[0],
        data_tomorrow: weatherData.data.daily[1],
        data_tonight: weatherData.data.hourly[tonight],

        tomorrow: tomorrow,
        today: today,
        hour: hour,
        
        language: langJSON,
        unit_symbols: unitsJSON,
      });
    } catch (error) {
      console.error("Failed to make request:", error.message);
      res.render("index", {
        error: error.message,
      });
    }
  }
  function AddDays(date,days) 
  {
      var result=new Date(date); 
      result.setDate(result.getDate() + days); 
      result = result.toLocaleDateString([], {day: '2-digit',month:'2-digit'});
      return result;
  }
// Listen
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });