// import { LargeNumberLike } from 'crypto';
import dotenv from "dotenv";
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(data, city) {
        this.city = city;
        this.date = data.dt_txt;
        this.icon = data.weather[0].icon;
        this.iconDescription = data.weather[0].main;
        this.tempF = this.convertKelvinToFahrenheit(data.main.temp);
        this.windSpeed = data.wind.speed;
        this.humidity = data.main.humidity;
    }
    convertKelvinToFahrenheit(kelvin) {
        return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        this.baseURL = process.env.API_BASE_URL;
        this.apiKey = process.env.API_KEY;
        this.city = "";
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        try {
            this.city = query;
            const response = await fetch(this.buildGeocodeQuery());
            const locationData = await response.json();
            return locationData[0];
        }
        catch (error) {
            return console.error(error);
        }
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        return {
            lat: locationData.lat,
            lon: locationData.lon,
        };
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery() {
        return `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        const locationData = await this.fetchLocationData(this.city);
        return this.destructureLocationData(locationData);
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        try {
            const response = await fetch(this.buildWeatherQuery(coordinates));
            const weatherData = await response.json();
            return weatherData;
        }
        catch (error) {
            return console.error(error);
        }
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        return new Weather(response.list[0], response.city.name);
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        const dailyForecastMap = new Map();
        weatherData.forEach((forecast) => {
            const date = new Date(forecast.dt_txt);
            const formattedDate = date.toISOString().split("T")[0];
            if (!dailyForecastMap.has(formattedDate)) {
                dailyForecastMap.set(formattedDate, forecast);
            }
        });
        const forecastArray = Array.from(dailyForecastMap.values()).sort((a, b) => new Date(a.dt_txt).getTime() - new Date(b.dt_txt).getTime());
        const weatherForecastArray = forecastArray.map((forecast) => new Weather(forecast, currentWeather.city));
        weatherForecastArray.unshift(currentWeather);
        return weatherForecastArray.slice(1, 7);
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        try {
            this.city = city;
            const coordinates = await this.fetchAndDestructureLocationData();
            const weatherData = await this.fetchWeatherData(coordinates);
            const currentWeather = this.parseCurrentWeather(weatherData);
            const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
            return [currentWeather, ...forecastArray.slice(1)];
        }
        catch (error) {
            return console.error(error);
        }
    }
}
export default new WeatherService();
