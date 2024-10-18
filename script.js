const weatherApiKey = 'b58d4385c5306488e79aef856afcb916';
let currentCity = localStorage.getItem('currentCity');
let currentTempInCelsius = null; // Store the current temperature in Celsius
let forecastData = {};
let currentPage = 1; 
const itemsPerPage = 10; // Number of items to display per page

// Get the unit from localStorage or default to Celsius
let currentUnit = localStorage.getItem('tempUnit') || 'celsius'; 

window.onload = function() {
    // Set the dropdown to the stored temperature unit
    const storedUnit = localStorage.getItem('tempUnit') || 'celsius';
    document.getElementById('tempUnitSelect').value = storedUnit; // Set the dropdown value

    fetchWeather(currentCity);
};


// Event Listener for Weather Button
document.getElementById('getWeatherBtn')?.addEventListener('click', getWeather);

// Event Listener for Unit Selection
document.getElementById('tempUnitSelect')?.addEventListener('change', () => {
    currentUnit = document.getElementById('tempUnitSelect').value;
    localStorage.setItem('tempUnit', currentUnit); // Store the unit in localStorage
    updateTemperatureUnit(); // Update the temperature unit in index.html
    if (window.location.href.includes('tables.html')) {
        displayForecastTable(); // Update the table display on tables.html
    }
});

// Fetch weather data when user enters a city
function getWeather() {
    const city = document.getElementById('cityInput').value;
    currentCity = city;
    fetchWeather(city);
}

// Fetch weather data from OpenWeather API
async function fetchWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`);
    const weatherData = await response.json();
    displayWeather(weatherData);
}

// Display weather data on the page (only for index.html)
function displayWeather(data) {
    if (document.getElementById('cityName')) {
        document.getElementById('cityName').innerText = data.name;
        document.getElementById('weatherDescription').innerText = data.weather[0].description;
        currentTempInCelsius = data.main.temp; // Store the temp in Celsius
        updateTemperatureDisplay(); // Display temperature based on selected unit
        document.getElementById('humidityValue').innerText = data.main.humidity;
        document.getElementById('windSpeedValue').innerText = data.wind.speed;
    }

    // Save the city name for table use
    localStorage.setItem('currentCity', data.name);

    // Fetch 5-day forecast for charts and table
    fetchForecast(currentCity);
}

// Update the temperature display based on the selected unit (for index.html)
function updateTemperatureUnit() {
    if (currentTempInCelsius !== null) {
        updateTemperatureDisplay();
    }
}

// Update the temperature in the DOM (for index.html)
function updateTemperatureDisplay() {
    const selectedUnit = localStorage.getItem('tempUnit') || 'celsius'; // Get unit from storage
    let temperatureToDisplay;

    if (selectedUnit === 'fahrenheit') {
        temperatureToDisplay = (currentTempInCelsius * 9/5) + 32; // Convert to Fahrenheit
        document.getElementById('tempValue').innerText = temperatureToDisplay.toFixed(2) + " °F"; // Display °F
    } else {
        temperatureToDisplay = currentTempInCelsius; // Keep in Celsius
        document.getElementById('tempValue').innerText = temperatureToDisplay.toFixed(2) + " °C"; // Display °C
    }
}

// Fetch forecast data from OpenWeather API
async function fetchForecast(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric`);
    forecastData = await response.json();

    // Store forecast data in localStorage for the table page
    localStorage.setItem('forecastData', JSON.stringify(forecastData));

    // Display data if we are on the main dashboard (index.html)
    if (document.getElementById('cityName')) {
        createCharts(forecastData);
    }
}

// Display forecast in the table (for tables.html)
function displayForecastTable() {
    const storedCity = localStorage.getItem('currentCity');
    const storedForecastData = localStorage.getItem('forecastData');
    
    if (storedCity && storedForecastData) {
        document.getElementById('cityName').innerText = storedCity;
        const forecastData = JSON.parse(storedForecastData);

        const tableBody = document.querySelector('#weatherTable tbody');
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * itemsPerPage; // Calculate start index for current page
        const endIndex = startIndex + itemsPerPage; // Calculate end index

        // Loop through the forecast data and add rows to the table
        forecastData.list.slice(startIndex, endIndex).forEach(entry => {
            const dateTime = new Date(entry.dt_txt); // Get the date and time
            const formattedDate = dateTime.toLocaleDateString(); // Format the date
            const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format the time

            // Handle temperature conversion for the table
            let tempToDisplay = entry.main.temp; // Celsius by default
            if (currentUnit === 'fahrenheit') {
                tempToDisplay = (tempToDisplay * 9/5) + 32; // Convert to Fahrenheit
            }

            const row = document.createElement('tr');
            row.innerHTML = `<td>${formattedDate}</td>
                             <td>${formattedTime}</td>
                             <td>${tempToDisplay.toFixed(2)} ${currentUnit === 'fahrenheit' ? '°F' : '°C'}</td>
                             <td>${entry.weather[0].description}</td>`;
            tableBody.appendChild(row);
        });

        // Show or hide pagination buttons
        const totalPages = Math.ceil(forecastData.list.length / itemsPerPage);
        document.getElementById('prevPage').style.display = currentPage === 1 ? 'none' : 'inline';
        document.getElementById('nextPage').style.display = currentPage === totalPages ? 'none' : 'inline';
    }
}

// Event Listeners for Pagination Buttons (for tables.html)
document.getElementById('prevPage')?.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayForecastTable();
    }
});

document.getElementById('nextPage')?.addEventListener('click', () => {
    const totalPages = Math.ceil(JSON.parse(localStorage.getItem('forecastData')).list.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayForecastTable();
    }
}); 

// Check which page we are on and display forecast accordingly (for tables.html)
if (window.location.href.includes('tables.html')) {
    displayForecastTable();
}

let tempBarChart, weatherDoughnutChart, tempLineChart; // Declare chart variables globally

// Function to create or update charts using Chart.js (only for index.html)
function createCharts(data) {
    const dates = data.list.map(entry => new Date(entry.dt_txt).toLocaleDateString());
    const temps = data.list.map(entry => entry.main.temp);

    // Destroy existing charts if they exist
    if (tempBarChart) tempBarChart.destroy();
    if (weatherDoughnutChart) weatherDoughnutChart.destroy();
    if (tempLineChart) tempLineChart.destroy();

    // Vertical Bar Chart
    tempBarChart = new Chart(document.getElementById('tempBarChart'), {
        type: 'bar',
        data: {
            labels: dates.slice(0, 5),
            datasets: [{
                label: `Temperature (${currentUnit === 'fahrenheit' ? '°F' : '°C'})`,
                data: temps.slice(0, 5).map(temp => currentUnit === 'fahrenheit' ? (temp * 9/5) + 32 : temp),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        }
    });

    // Doughnut Chart for weather conditions
    const weatherConditions = data.list.slice(0, 5).map(entry => entry.weather[0].main);
    weatherDoughnutChart = new Chart(document.getElementById('weatherDoughnutChart'), {
        type: 'doughnut',
        data: {
            labels: ['Sunny', 'Cloudy', 'Rainy'],
            datasets: [{
                data: [
                    weatherConditions.filter(c => c === 'Clear').length,
                    weatherConditions.filter(c => c === 'Clouds').length,
                    weatherConditions.filter(c => c === 'Rain').length
                ],
                backgroundColor: ['yellow', 'gray', 'blue']
            }]
        }
    });

    // Line Chart
    tempLineChart = new Chart(document.getElementById('tempLineChart'), {
        type: 'line',
        data: {
            labels: dates.slice(0, 5),
            datasets: [{
                label: `Temperature (${currentUnit === 'fahrenheit' ? '°F' : '°C'})`,
                data: temps.slice(0, 5).map(temp => currentUnit === 'fahrenheit' ? (temp * 9/5) + 32 : temp),
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        }
    });
}

document.getElementById('cityInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        getWeather();  // Call the weather fetching function
    }
});
