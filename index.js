

const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name;
  const clientIp = req.ip;

  try {
    // Get location data based on IP address
    const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    const locationData = locationResponse.data;
    const city = locationData.city;

    // Get weather data for the city
    const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`);
    const weatherData = weatherResponse.data;
    const temperature = weatherData.current.temp_c;

    // Create the response
    const response = {
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}`
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving location or weather data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
