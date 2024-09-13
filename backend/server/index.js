const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/get-air-quality', async (req, res) => {
    const { city } = req.body;

    try {
        const weatherbitResponse = await fetch(`https://api.weatherbit.io/v2.0/current/airquality?city=${city}&key=e476601f555645509a852f9a9e5a1041`);
        if (!weatherbitResponse.ok) {
            throw new Error(`Weatherbit API: ${weatherbitResponse.status}`);
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
        res.status(500).json({ error: `Error obteniendo calidad del aire: ${error.message}` });
    }
});

app.post('/api/get-chatgpt-response', async (req, res) => {
  const apiKey = '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'; // Replace with your actual API key

  try {
      const { airQualityString, city } = req.body;

      const messages = [
          { role: 'system', content: 'You are an assistant that provides actionable insights based on air quality data.' },
          { role: 'user', content: `Basándote en los datos de la calidad del aire: ${airQualityString}, ¿qué tres acciones específicas se pueden tomar para mejorar la calidad del aire en la ciudad ${city}? Especifica por qué cada una de estas acciones sería efectiva en esa ciudad. Hazlas cortas` }
      ];

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: messages,
              max_tokens: 150,
              temperature: 0.7
          })
      });

      if (!openaiResponse.ok) {
          throw new Error(`OpenAI API: ${openaiResponse.status}`);
      }

      const openaiData = await openaiResponse.json();
      const chatGptResponse = openaiData.choices[0].message.content.trim();
      res.json({ chatGptResponse });

  } catch (error) {
      console.error('Error obteniendo respuesta de ChatGPT:', error);
      res.status(500).send('Error obteniendo respuesta de ChatGPT.');
  }
});


app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
