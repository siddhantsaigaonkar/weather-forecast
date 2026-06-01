// const apiKey = "fbb435454ac671e7796547fd63f5b4a2";

const API_KEY = "fbb435454ac671e7796547fd63f5b4a2";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const recentCities = document.getElementById("recentCities");
const clearRecent = document.getElementById("clearRecent");

// degree to f

let isCelsius = true;
let currentTemp = 0;

document.addEventListener("DOMContentLoaded", () => {
  loadRecentCities();
  getWeather("Pune");
});

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name");
    return;
  }

  getWeather(city);
});


cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeather(cityInput.value.trim());
  }
});


locationBtn.addEventListener("click", () => {
  getCurrentLocation();
});

recentCities.addEventListener("change", () => {
  const city = recentCities.value;

  if (city) {
    getWeather(city);
  }
});

// ADD HERE
clearRecent.addEventListener("click", () => {
  localStorage.removeItem("recentCities");
  loadRecentCities();
});

// error

function showError(message) {
  const errorBox = document.getElementById("errorBox");

  errorBox.textContent = message;
  errorBox.classList.remove("hidden");

  setTimeout(() => {
    errorBox.classList.add("hidden");
  }, 3000);
}

async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
    );

    const data = await response.json();

    if (data.cod !== "200") {
      showError("City not found");
      return;
    }

    saveRecentCity(city);
    displayCurrentWeather(data);
    displayForecast(data);
  } catch (error) {
    console.error(error);
  }
}

function displayCurrentWeather(data) {

  const weather = data.list[0];
 

  currentTemp = weather.main.temp;
  isCelsius = true;

  const condition = weather.weather[0].main;
if (condition === "Rain") {
  document.body.className =
    "min-h-screen bg-gradient-to-br from-blue-900 to-slate-800 text-white py-10";
} else if (condition === "Clouds") {
  document.body.className =
    "min-h-screen bg-gradient-to-br from-gray-700 to-gray-900 text-white py-10";
} else if (condition === "Clear") {
  document.body.className =
    "min-h-screen bg-gradient-to-br from-sky-400 to-blue-700 text-white py-10";
} else {
  document.body.className =
    "min-h-screen bg-gradient-to-br from-zinc-900 to-slate-900 text-white py-10";
  }
  if (weather.main.temp > 40) {
    showError("Extreme Heat Warning! Temperature is above 40°C");
  };

  const currentWeather = document.getElementById("currentWeather");

  currentWeather.classList.remove("hidden");

  currentWeather.innerHTML = `
    <div class="bg-linear-to-r from-[#020b2e] to-[#000c3f] rounded-3xl p-6 text-white">

      <!-- Top -->
      <div class="flex justify-between items-start">

        <div>
          <p class="text-gray-400 text-sm">
            📍 ${data.city.name}, India
          </p>


          <h2 class="text-5xl font-bold mt-2">
            ${data.city.name}
          </h2>
        </div>

        <div>
          <span class="border border-gray-700 px-4 py-2 rounded-full text-sm">
            Current State
          </span>
        </div>

      </div>

      <!-- Middle -->
      <div class="flex items-center gap-6 mt-8">

        <div class="w-28 h-28 rounded-full border border-gray-700 flex items-center justify-center">
          <img
            src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png"
            class="w-20 h-20"
          />
        </div>
<div>
  <h3
    id="temperature"
    class="text-6xl font-bold"
  >
    ${Math.round(weather.main.temp)}°C
  </h3>

  <button
    id="tempToggle"
    class="mt-3 bg-cyan-600 hover:bg-cyan-700 px-3 py-2 rounded-lg text-sm cursor-pointer"
  >
    Switch to °F
  </button>

  <p class="text-2xl text-blue-300 font-semibold mt-2">
    ${weather.weather[0].main}
  </p>
</div>

      </div>

      <!-- Description -->
      <div class="mt-8 border border-gray-800 rounded-xl p-4 bg-black/10">
        <p class="italic text-gray-300">
          "${weather.weather[0].description}"
        </p>
      </div>

      <!-- Bottom Stats -->
      <div class="grid grid-cols-3 gap-4 mt-8 border-t border-gray-800 pt-6">

        <div>
          <p class="text-gray-400 text-sm uppercase">
            Humidity
          </p>

          <p class="text-xl font-bold">
            ${weather.main.humidity}%
          </p>
        </div>

        <div>
          <p class="text-gray-400 text-sm uppercase">
            Wind Speed
          </p>

          <p class="text-xl font-bold">
            ${weather.wind.speed} m/s
          </p>
        </div>

        <div>
          <p class="text-gray-400 text-sm uppercase">
            Feels Like
          </p>

          <p class="text-xl font-bold">
            ${Math.round(weather.main.feels_like)}°C
          </p>
        </div>

      </div>

    </div>
  `;

  const tempToggle = document.getElementById("tempToggle");
  const temperature = document.getElementById("temperature");

  tempToggle.addEventListener("click", () => {
    if (isCelsius) {
      const fahrenheit = (currentTemp * 9) / 5 + 32;

      temperature.textContent = `${Math.round(fahrenheit)}°F`;

      tempToggle.textContent = "Switch to °C";

      isCelsius = false;
    } else {
      temperature.textContent = `${Math.round(currentTemp)}°C`;

      tempToggle.textContent = "Switch to °F";

      isCelsius = true;
    }
  });
}

function displayForecast(data) {
  const forecastContainer = document.getElementById("forecastContainer");

  forecastContainer.innerHTML = "";

  const dailyForecasts = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00"),
  );

  dailyForecasts.slice(0, 5).forEach((day) => {
    const date = new Date(day.dt_txt);

    const dayName = date
      .toLocaleDateString("en-US", {
        weekday: "short",
      })
      .toUpperCase();

    const dayDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const rainChance = day.pop ? Math.round(day.pop * 100) : 0;

    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    forecastContainer.innerHTML += `
    
      <div class="bg-[#04122d] border border-cyan-900 rounded-[30px] p-5 text-white">

          <!-- Header -->
          <div class="flex justify-between items-center">

              <div class="flex items-center justify-center">
                  <h3 class="font-bold text-xl">
                      ${dayName}
                  </h3>

              </div>

              <div class="border border-cyan-700 rounded-lg px-3 py-1 font-semibold">
                  ${Math.round(day.main.temp_max)}°
                  /
                  ${Math.round(day.main.temp_min)}°
              </div>

          </div>
           
          <div class="flex items-center justify-center mt-3">
            <p class="text-gray-400">
                      ${dayDate}
                  </p>

          </div>
            

          <!-- Icon -->
          <div class="flex justify-center my-3">

              <div
                  class="w-24 h-24 rounded-full border border-cyan-800 flex items-center justify-center"
              >
                  <img
                      src="${iconUrl}"
                      class="w-16 h-16"
                  >
              </div>

          </div>

          <!-- Weather Description -->
          <h2 class="text-center text-xl font-bold mb-5 capitalize">
              ${day.weather[0].description}
          </h2>

          <!-- Stats -->
          <div class="bg-[#081b3f] rounded-2xl p-4">

              <div class="flex justify-between mb-2">
                  <span>💧 Humidity</span>
                  <span class="text-cyan-400">
                      ${day.main.humidity}%
                  </span>
              </div>

              <div class="flex justify-between mb-2">
                  <span>🌧 Rain Chance</span>
                  <span class="text-cyan-400">
                      ${rainChance}%
                  </span>
              </div>

              
          <div class="flex justify-between mb-2">
    <span>🌬 Wind</span>
    <span class="text-cyan-400">
        ${day.wind.speed} m/s
    </span>
</div>

              <hr class="border-cyan-900 my-3">

          </div>

          <!-- Bottom Badge -->
          <div
              class="mt-5 bg-green-950 border border-green-700 rounded-md py-3 text-center"
          >
              <span class="text-emerald-400 font-semibold">
                  ${rainChance > 60 ? "🌧 High Chance of Rain" : "☀ Low Chance of Rain"}
              </span>
          </div>

      </div>
    
    `;
  });
};

function getCurrentLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      getWeatherByCoords(lat, lon);
    },
    (error) => {
      showError("Unable to get your location.");
      console.error(error);
    },
  );
};

async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    );

    const data = await response.json();

    displayCurrentWeather(data);
    displayForecast(data);
  } catch (error) {
    console.error(error);
  }
};

//

function saveRecentCity(city) {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

  if (!cities.includes(city)) {
    cities.unshift(city);

    if (cities.length > 5) {
      cities.pop();
    }

    localStorage.setItem("recentCities", JSON.stringify(cities));
  }

  loadRecentCities();
}

function loadRecentCities() {
  const cities = JSON.parse(localStorage.getItem("recentCities")) || [];

if (cities.length === 0) {
  recentCities.classList.add("hidden");
  clearRecent.classList.add("hidden");
  return;
}

  recentCities.classList.remove("hidden");
  clearRecent.classList.remove("hidden");
  recentCities.innerHTML = '<option value="">Recent Searches</option>';

  cities.forEach((city) => {
    recentCities.innerHTML += `
      <option value="${city}">
        ${city}
      </option>
    `;
  });
};

