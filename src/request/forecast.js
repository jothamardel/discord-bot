const axios = require("axios");

const URL = "https://api.weatherapi.com/v1/forecast.json";
const FORECAST_DAYS = 3;
async function fetchForeCast({ location = "London", units = "metric" }) {
  try {
    const response = await axios({
      url: URL,
      method: "get",
      params: {
        key: process.env.WEATHER_API_KEY,
        q: location,
        days: FORECAST_DAYS,
        aqi: "no",
        alerts: "no",
      },
      responseType: "json",
    });
    const country = response.data.location.country;
    const city = response.data.location.name;
    const locationName = `${city}, ${country}`;

    const weatherData = response.data.forecast.forecastday.map(
      (forecastDay) => {
        const date = forecastDay.date;
        const minTempC = forecastDay.day.mintemp_c;
        const minTempF = forecastDay.day.mintemp_f;
        const maxTempC = forecastDay.day.maxtemp_c;
        const maxTempF = forecastDay.day.maxtemp_f;
        const avgTempC = forecastDay.day.avgtemp_c;
        const avgTempF = forecastDay.day.avgtemp_f;
        const condition = forecastDay.day.condition.text;
        const sunriseTime = forecastDay.astro.sunrise;
        const sunsetTime = forecastDay.astro.sunset;
        const moonriseTime = forecastDay.astro.moonrise;
        const moonsetTime = forecastDay.astro.moonset;
        return {
          date,
          minTempC,
          minTempF,
          maxTempC,
          maxTempF,
          avgTempC,
          avgTempF,
          condition,
          sunriseTime,
          sunsetTime,
          moonriseTime,
          moonsetTime,
        };
      }
    );
    // .filter((item) => item);

    return {
      locationName,
      weatherData,
      country,
      city,
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching forecast data for ${location}`);
  }
}

module.exports = { fetchForeCast };
