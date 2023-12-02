import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";
import { options } from "prettier-plugin-tailwindcss";
import fs from "fs";

/**
 * Language JSON files.
 */
let en = JSON.parse(fs.readFileSync("language/en.json"));
let tr = JSON.parse(fs.readFileSync("language/tr.json"));
let fr = JSON.parse(fs.readFileSync("language/fr.json"));
let de = JSON.parse(fs.readFileSync("language/de.json"));
let jp = JSON.parse(fs.readFileSync("language/jp.json"));


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
let units = "metric";
let lang = "tr";




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
    weatherData = await axios.get(API_URL + `lat=${latitude}&lon=${longitude}&lang=${lang}&units=${units}&appid=${API_KEY}`);
    res.render("location", {city: cityLoc.data[0], data: weatherData.data , units:units, language:tr });
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
    units = req.body.userUnit;
  }
  if(req.body.userLang){
    lang = req.body.userLang;
  }
  /**
 * You have to bind lang to the  userLang value to switch both text language and json.
 */
  var path = req.body.page;
  console.log(units);
  //console.log("Current path : " + path);
  //console.log(lang);
  /*Try and do a new request */
  cityLoc = await axios.get(API_CITY_URL + `q=${cityLoc.data[0].name}&limit=5&appid=${API_KEY}`);
  const latitude = cityLoc.data[0].lat;
  const longitude = cityLoc.data[0].lon;
  weatherData = await axios.get(API_URL + `lat=${latitude}&lon=${longitude}&lang=${lang}&units=${units}&appid=${API_KEY}`);
  res.render(`${path}`, {city: cityLoc.data[0],data_daily: weatherData.data.daily[0] ,data_tonight: weatherData.data.hourly[tonight] , data: weatherData.data});
})

app.post("/details", (req,res) => {
  res.render("details", {city: cityLoc.data[0], data:weatherData.data ,data_daily: weatherData.data.daily[0] ,data_tonight: weatherData.data.hourly[tonight] , units:units ,language:tr});
})
app.post("/tomorrow", (req,res) => {
  res.render("details", {city: cityLoc.data[0], data:weatherData.data ,data_daily: weatherData.data.daily[1] ,data_tonight: weatherData.data.hourly[tonightTomorrow] , units:units,language:tr });
})
app.post("/location", (req,res) => {
  res.render("location", {city: cityLoc.data[0], data: weatherData.data , units:units, language:tr });
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
