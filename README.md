Weather Dashboard and AI Chatbot
This project is a weather dashboard that provides real-time weather updates and a 5-day forecast for a specified city. It features a paginated table for displaying forecast data, charts for weather visualization, and an AI-powered chatbot integrated with Google Generative AI (Gemini API) for conversational queries.

How to Run:
simply run the index.html to access the project.

This project is also deployed on github by the url:
https://farzam901.github.io/

Weather Dashboard:
Displays current weather data (temperature, humidity, wind speed) and a 5-day forecast using the OpenWeather API.
Chart.js visualizations (bar, doughnut, and line charts) for a graphical representation of weather trends.
Sidebar navigation for easy access between dashboard and forecast tables.
Forecast Table:

Paginated table displaying detailed weather forecasts for each day, with next/previous buttons to navigate through the data.
AI Chatbot:

Integrated with Google's Generative AI (Gemini API) to handle user queries.
Capable of providing responses to weather-related questions, fetching real-time weather data for a specified city.
Technologies Used
HTML/CSS/JavaScript: For building the frontend.
OpenWeather API: To fetch real-time weather data.
Chart.js: For creating responsive charts that visualize temperature trends.
Google Generative AI (Gemini API): To integrate an AI chatbot capable of answering user queries.
Project Structure
bash
Copy code
├── index.html          # Main weather dashboard with charts
├── tables.html         # Forecast table page
├── styles.css          # Styling for the dashboard and tables
├── script.js           # JavaScript logic for weather fetching and charts
├── README.txt          # Project documentation


Usage
Weather Dashboard:

Enter a city name in the search bar and click "Get Weather" to fetch weather data.
The dashboard displays the current weather and a 5-day forecast with graphical charts.
Tables:

Navigate to the "Tables" page to view the weather forecast in a tabular format with pagination controls.

AI Chatbot:
On the "Tables" page, type any query in the chatbot section. You can ask weather-related questions like:
"What's the weather in Paris?"
"Tell me the temperature in New York."

Or even advanced queries such as:
"What's the weather forecast for Paris in the next 5 days?"
"Show me the temperature in London for the next 3 days."

"Get me the forecast for New York tomorrow."
"How will the weather be in Berlin on 2024-10-20?"

Charts:
View charts (bar, doughnut, line) showing temperature data and weather conditions.

API Integration:

OpenWeather API:
Used to fetch real-time weather data and a 5-day forecast. You need to register at OpenWeather and obtain an API key.

Google Generative AI (Gemini API):
Integrated with the chatbot for natural language processing and response generation. Get your API key from Google Cloud.



JavaScript/jQuery Implementation:
AJAX: Efficient use of the fetch() API for asynchronous requests to the OpenWeather API, retrieving both current weather and forecast data.

Error Handling: Utilized try...catch blocks to handle potential errors during API requests. Errors are logged to the console, with room to improve by displaying user-friendly messages in the DOM.

Dynamic DOM Manipulation: The script dynamically updates the weather details and charts using data from the API. Weather charts are updated in real-time using Chart.js.



Future Enhancements
Error Handling: Add improved error handling for invalid city inputs or API failures.
Loading Indicators: Implement loading indicators when fetching data from the API.
AI Chatbot Enhancements: Improve AI chatbot capabilities by adding more context-based responses, e.g., fetching weather for different cities dynamically from the user's query.This application is made for people to see weather and make tables.
