import React, { useRef, useState } from 'react';
import "./Weather.css";
import search_icone from "../assets/search.png";
import clear_icone from "../assets/clear.png";
import cloud_icone from "../assets/cloud.png";
import drizzle_icone from "../assets/drizzle.png";
import humiditi_icone from "../assets/humidity.png";
import rain_icone from "../assets/rain.png";
import snow_icone from "../assets/snow.png";
import wind_icone from "../assets/wind.png";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Weather() {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);

    const allIcons = {
        "01d": clear_icone,
        "01n": clear_icone,
        "02d": cloud_icone,
        "02n": cloud_icone,
        "03d": cloud_icone,
        "03n": cloud_icone,
        "04d": drizzle_icone,
        "04n": drizzle_icone,
        "09d": rain_icone,
        "09n": rain_icone,
        "10d": rain_icone,
        "10n": rain_icone,
        "13d": snow_icone,
        "13n": snow_icone
    };

    const search = async (city) => {
        if (!city) {
            alert("Enter city name");
            return;
        }

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}&units=metric`;
        let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${import.meta.env.VITE_APP_ID}&units=metric`;

        try {
            const response = await fetch(url);
            const forecastResponse = await fetch(forecastUrl);
            const data = await response.json();
            const forecast = await forecastResponse.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            const icon = allIcons[data.weather[0].icon] || clear_icone;
            setWeatherData({
                humidity: data.main.humidity,
                windspeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            });

            const forecastTemps = forecast.list.slice(0, 8).map(item => ({
                time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                temp: Math.floor(item.main.temp)
            }));
            setForecastData(forecastTemps);

        } catch (error) {
            setWeatherData(null);
            console.error("Error in fetching Weather Data", error);
        }
    };

    return (
        <div className='weather'>
            {/* New Animated Heading */}
            <h3 className="weather-heading">Weather Forecast App</h3>
            
            <div className='search-bar'>
                <input ref={inputRef} type='text' placeholder='Search city' />
                <img src={search_icone} alt='Search' onClick={() => search(inputRef.current.value)} />
            </div>
            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt="" className='weather-icon' />
                    <p className='deg'>{weatherData.temperature}°C</p>
                    <p className='place'>{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humiditi_icone} alt="" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icone} alt="" />
                            <div>
                                <p>{weatherData.windspeed} Km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>

                    {/* Temperature Graph */}
                    <div className='weather-graph'>
                        <h3>Temperature Forecast (Next 24 hours)</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={forecastData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="temp" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
}

export default Weather;
