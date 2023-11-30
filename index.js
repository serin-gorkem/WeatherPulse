import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import "dotenv/config";
import { options } from "prettier-plugin-tailwindcss";

const app = express();
const port = 3000;
const API_KEY = process.env.API_KEY;
const API_URL = "https://api.openweathermap.org/data/3.0/onecall?";
const API_CITY_URL = "http://api.openweathermap.org/geo/1.0/direct?";

let cityLoc;
let weatherData;
let units = "metric";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//for detecting ejs files.
app.set("view engine", "ejs");

app.get("/", (req,res) =>{
  res.render("index"); 
})
app.post("/", async (req,res) => {
  // Inside 
  const cityName = req.body.city_name
  //Debug
  // console.log(cityName);
  // console.log(API_CITY_URL + `q=${cityName}&limit=5&appid=${API_KEY}`);
  // res.redirect("/")
  try {
    cityLoc = await axios.get(API_CITY_URL + `q=${cityName}&limit=5&appid=${API_KEY}`);
    const latitude = cityLoc.data[0].lat;
    const longitude = cityLoc.data[0].lon;
    //Debug
    //console.log("City Latitude: " + latitude +" and Longitude: " + longitude);
    weatherData = await axios.get(API_URL + `lat=${latitude}&lon=${longitude}&units=${units}&appid=${API_KEY}`);
    //console.log(API_URL + `lat=${latitude}&lon=${longitude}&exclude=current&appid=${API_KEY}`);
    //console.log(weather.data.daily[0].temp.day);
    res.render("location", {city: cityLoc.data[0], data: weatherData.data , units:units});
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("location", {
      error: error.message,
    });
  }
})
app.post("/details", async (req,res) => {
  res.render("details", {city: cityLoc.data[0], data: weatherData.data , units:units });
})
app.post("/units", async (req,res) => {
  units = req.body.userSelect;
  res.render("location", {city: cityLoc.data[0], data: weatherData.data });
  console.log(units);
})
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
