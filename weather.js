document.addEventListener('DOMContentLoaded', () => {
    const weatherDetails = document.getElementById('weatherDetails');
    const weatherIcon = document.getElementById('weatherIcon');

    const apiKey = "8ddcda2c6bd440dc1b40f6864d924e80"; // Replace with your OpenWeather API key

    // Default Location (Fallback if Geolocation is Denied)
    const defaultCity = "Comilla"; // Change this to your preferred default city
    const defaultCountry = "BD"; // Change to the country code of your choice

    function fetchWeather(lat, lon, isDefault = false) {
        let weatherApiUrl;
        
        if (isDefault) {
            // Fetch by City Name if using Default Location
            weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity},${defaultCountry}&units=metric&appid=${apiKey}`;
        } else {
            // Fetch by Latitude & Longitude if Geolocation is Enabled
            weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        }

        fetch(weatherApiUrl)
            .then(response => response.json())
            .then(data => {
                const temperature = data.main.temp;
                const weatherDescription = data.weather[0].description;
                const cityName = data.name; // Get the city name
                const iconCode = data.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

                weatherDetails.innerHTML = `<strong>${cityName}</strong> - 🌡 ${temperature}°C | ${weatherDescription}`;
                weatherIcon.src = iconUrl;
            })
            .catch(error => {
                console.error("Weather Fetch Error:", error);
                weatherDetails.innerHTML = "Weather not available.";
            });
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    // If user allows location, fetch weather with lat/lon
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                error => {
                    console.error("Geolocation Error:", error);
                    // Use Default Location if user denies permission
                    fetchWeather(null, null, true);
                }
            );
        } else {
            // If Geolocation is not supported, use Default Location
            fetchWeather(null, null, true);
        }
    }

    getLocation(); // Fetch weather on page load
});
