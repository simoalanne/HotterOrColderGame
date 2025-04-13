import { useState } from 'react';
import { WeatherContext } from './WeatherContext';

const WeatherProvider = ({ children }) => {
    const [weatherData, setWeatherData] = useState([]);

    return (
        <WeatherContext.Provider value={{ weatherData, setWeatherData }}>
            {children}
        </WeatherContext.Provider>
    );
};

export default WeatherProvider;
