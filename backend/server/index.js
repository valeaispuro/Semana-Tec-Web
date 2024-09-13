const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const { OpenAI } = require('openai');
const fetch = require('node-fetch');
//const dotenv = require('dotenv');

//dotenv.config();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: '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', // Replace with your OpenAI API key
});

app.post('/api/get-air-quality', async (req, res) => {
    const {city} = req.body;
    //const {weatherbitApiKey} = apis.env.WEATHERBIT_API_KEY;
    //const {weatherbitApiKey} = 'e476601f555645509a852f9a9e5a1041';

    try {
        const weatherbitResponse = await fetch("https://api.weatherbit.io/v2.0/current/airquality?city=${city}&key=e476601f555645509a852f9a9e5a1041");
        if (!weatherbitResponse.ok) {
            throw new Error("Weatherbit API: ${weatherbitResponse.status}");
        }

        const weatherbitData = await weatherbitResponse.json();
        if (!weatherbitData || !weatherbitData.data || weatherbitData.data.length === 0) {
            throw new Error('Respuesta inválida');
        }

        const airQualityData = weatherbitData.data[0];
        const airQualityString = `
            AQI: ${airQualityData.aqi}, 
            O3: ${airQualityData.o3}, 
            SO2: ${airQualityData.so2}, 
            NO2: ${airQualityData.no2}, 
            CO: ${airQualityData.co}, 
            PM10: ${airQualityData.pm10}, 
            PM2.5: ${airQualityData.pm25}, 
            Predominant Pollen: ${airQualityData.predominant_pollen_type}
        `;

        res.json({
            city,
            airQuality: airQualityString
        });
    } catch (error) {
        console.error("Error obteniendo datos:", error);
        res.status(500).json({ error: "Error obteniendo calidad del aire: ${error.message}" });
    }
});

app.post('/api/get-chatgpt-response', async (req, res) => {
  const { airQualityString } = req.body;
  const {city} = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Con esta informacion: ${airQualityString}, propon actividades que se puedan hacer en la ciudad ${city} para mejorar la salud de la ciudad.`
        }
      ],
    });

    res.json({
      chatGptResponse: response.choices[0]?.message?.content || "No response"
    });
  } catch (error) {
    console.error("Error obteniendo respuesta de ChatGPT:", error);
    res.status(500).json({ error: `Error obteniendo respuesta de ChatGPT: ${error.message}` });
  }
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
