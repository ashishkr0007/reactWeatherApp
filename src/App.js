import "./App.css";

import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeandLocation from "./components/TimeandLocation";
import { TemperatureAndDetails } from "./components/TemperatureAndDetails";
import { Forcast } from "./components/Forcast";
import getFormattedWeatherData from "./services/weatherService";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [query, setQuery] = useState({ q: "bangalore" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getFormattedWeatherData({ ...query, units });

        // Check if the response contains an error
        if (data.cod && data.cod !== "200") {
          toast.error(`Error: ${data.message}`);
          return;
        }

        toast.success(
          `Successfully fetched weather for ${data.name}, ${data.country}.`
        );
        setWeather(data);
      } catch (error) {
        toast.error("Entered City Name is Wrong");
        //console.error(error);
      }
    };

    fetchWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-700 to-blue-700";

    return "from-yellow-700 to-orange-700";
  };

  return (
    <div
      className={`mx-auto max-w-screen-md mt-4 py-5 px-4 sm:px-32 bg-gradient-to-br  h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}
    >
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

      {weather && (
        <div>
          <TimeandLocation weather={weather} />
          <TemperatureAndDetails weather={weather} />

          {/* Mobile-specific styling for hourly forecast
          <Forcast
            title="hourly forecast"
            items={weather.hourly}
            className="sm:hidden"
          />   */}

          <Forcast title="daily forecast" items={weather.daily} />

          {/* Laptop-specific styling for hourly forecast */}
          <Forcast
            title="hourly forecast"
            items={weather.hourly}
            className="hidden sm:block"
          />
        </div>
      )}
      <ToastContainer autoClose={5000} theme="colored" newestOnTop={true} />
    </div>
  );
}

export default App;
