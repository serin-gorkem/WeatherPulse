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

const app = express();
const port = 3000;
/**
 * API Values
 */
const API_KEY = process.env.API_KEY;
const API_URL = "https://api.openweathermap.org/data/3.0/onecall?";
const API_CITY_URL = "http://api.openweathermap.org/geo/1.0/direct?";
let cityLoc;
let weatherData;
let unitsJSON = metricJSON;
let langJSON = enJSON;

/**
 * Date values
 */
let currentDate = new Date();
let date = currentDate.toLocaleDateString([], {day: '2-digit',month:'2-digit'});
let currentHour = currentDate.getHours();
const tonight =Math.abs(24 - currentHour);
const tonightTomorrow = Math.abs(48 - currentHour);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//for detecting ejs files.
app.set("view engine", "ejs");

app.get("/", (req,res) =>{
  res.render("index"); 
})
app.post("/", async (req,res) => {
  const cityName = req.body.city_name
  //Debug
  // console.log(cityName);
  // console.log(API_CITY_URL + `q=${cityName}&limit=5&appid=${API_KEY}`);
  // res.redirect("/")
  try {
    cityLoc = await axios.get(API_CITY_URL + `q=${cityName}&limit=5&appid=${API_KEY}`);
    const latitude = cityLoc.data[0].lat;
    const longitude = cityLoc.data[0].lon;
    weatherData = await axios.get(API_URL + `lat=${latitude}&lon=${longitude}&lang=${langJSON.language_name}&units=${unitsJSON.unit_name}&appid=${API_KEY}`);
    res.render("location", {city: cityLoc.data[0], data: weatherData.data , units:unitsJSON.unit_name, language:langJSON, unit_symbols:unitsJSON});
    //Debug
    //console.log("City Latitude: " + latitude +" and Longitude: " + longitude);
    //console.log(API_URL + `lat=${latitude}&lon=${longitude}&exclude=current&appid=${API_KEY}`);
    //console.log(weather.data.daily[0].temp.day);
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("location", {
      error: error.message,
    });
  }
})

app.post("/pref", async (req,res) => {
  if(req.body.userUnit){
    unitsJSON.unit_name = req.body.userUnit;
  }
  if(req.body.userLang){
    langJSON.language_name = req.body.userLang;
  }
  /**
 * You have to bind lang to the  userLang value to switch both text language and json.
 */
  var path = req.body.page;
  if(path === null){
    path = "location";
  }
  // console.log("Current path : " + path);
  /*Try and do a new request */
  switch (langJSON.language_name) {
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
  switch (unitsJSON.unit_name) {
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
  console.log("Server Language: "+ langJSON.language_name);
  cityLoc = await axios.get(API_CITY_URL + `q=${cityLoc.data[0].name}&limit=5&appid=${API_KEY}`);
  const latitude = cityLoc.data[0].lat;
  const longitude = cityLoc.data[0].lon;
  weatherData = await axios.get(API_URL + `lat=${latitude}&lon=${longitude}&lang=${langJSON.language_name}&units=${unitsJSON.unit_name}&appid=${API_KEY}`);
  res.render(`${path}`, {
    city: cityLoc.data[0],
    data_daily: weatherData.data.daily[0] ,
    data_tonight: weatherData.data.hourly[tonight],
    data: weatherData.data,
    language: langJSON,
    unit_symbols: unitsJSON
  });
})
  app.post("/details", (req,res) => {
    res.render("details",
    {city: cityLoc.data[0],
      data:weatherData.data,
      data_daily: weatherData.data.daily[0],
      data_tonight: weatherData.data.hourly[tonight],
      units:unitsJSON.unit_name,
      language: langJSON,
      unit_symbols: unitsJSON

      });
  })
  app.post("/tomorrow", (req,res) => {
    res.render("details", {
      city: cityLoc.data[0],
      data:weatherData.data,
      data_daily: weatherData.data.daily[1],
      data_tonight: weatherData.data.hourly[tonightTomorrow],
      units:unitsJSON.unit_name,
      language: langJSON,
      unit_symbols: unitsJSON

    });
  })
  app.post("/location", (req,res) => {
    res.render("location", {
      city: cityLoc.data[0],
      data:weatherData.data,
      data_daily: weatherData.data.daily[1],
      data_tonight: weatherData.data.hourly[tonightTomorrow],
      units:unitsJSON.unit_name,
      language: langJSON,
      unit_symbols: unitsJSON

    });
  })

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
