const API_KEY = "eb9fd962dae9285b60b419c827c10c76"; // Replace with your OpenWeatherMap API key

const getWeatherBtn = document.getElementById("getWeather");
const unitToggle = document.getElementById("unitToggle");
const weatherDetails = document.getElementById("weatherDetails");
const weatherIcon = document.getElementById("weatherIcon");
const errorDiv = document.getElementById("error");

let unit = localStorage.getItem("unit") || "metric"; // default to Celsius

// Initialize toggle position
unitToggle.checked = unit === "imperial";

unitToggle.addEventListener("change", () => {
  unit = unitToggle.checked ? "imperial" : "metric";
  localStorage.setItem("unit", unit);
});

getWeatherBtn.addEventListener("click", () => {
  weatherDetails.innerHTML = "Loading...";
  weatherIcon.style.display = "none";
  errorDiv.textContent = "";

  if (!navigator.geolocation) {
    errorDiv.textContent = "Geolocation is not supported.";
    weatherDetails.innerHTML = "";
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error);

  function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`)
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch weather");
        return response.json();
      })
      .then(data => {
        const { name, main, weather } = data;
        const iconCode = weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const unitSymbol = unit === "metric" ? "°C" : "°F";

        weatherDetails.innerHTML = `
          <strong>${name}</strong><br/>
          ${main.temp}${unitSymbol}<br/>
          ${weather[0].description}
        `;

        weatherIcon.src = iconUrl;
        weatherIcon.style.display = "block";
      })
      .catch(() => {
        weatherDetails.innerHTML = "";
        errorDiv.textContent = "Failed to get weather data.";
      });
  }

  function error() {
    weatherDetails.innerHTML = "";
    errorDiv.textContent = "Location access denied or unavailable.";
  }
});
