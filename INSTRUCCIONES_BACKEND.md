# INSTRUCCIONES PARA EL BACKEND (NODE.JS / EXPRESS)

Para que la aplicación funcione en producción de manera segura, debes agregar un nuevo endpoint en tu backend de Node.js. Este endpoint actuará como un "Proxy Seguro" para ocultar las llaves de la API de Siesa.

## 1. Variables de Entorno en el Backend
Asegúrate de que tu backend (en Vercel, Railway, o donde esté alojado) tenga configuradas las siguientes variables de entorno. **NO** las pongas en el código, úsalas desde el entorno.

```env
CONNEKTA_KEY=c80b49b78df52a8ff6ed3ea977fae4ad
CONNEKTA_TOKEN=TU_TOKEN_AQUI
CONNEKTA_BASE_URL=https://serviciosqa.siesacloud.com
```

## 2. Dependencias Necesarias
Asegúrate de tener instalada una librería para hacer peticiones HTTP, como `axios` (recomendado) o `node-fetch`.

```bash
npm install axios
```

## 3. Código para el Endpoint (Express.js)

Agrega este código a tu archivo principal de rutas (ej: `index.js`, `app.js` o `routes.js`).

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

// ... tu configuración existente ...

app.get('/siesa-proxy', async (req, res) => {
  try {
    // 1. Obtener parámetros de la URL original
    // Extraemos endpoint_type y dejamos el resto de parámetros para enviarlos a Siesa
    const { endpoint_type, ...queryParams } = req.query;
    
    // 2. Definir la URL destino de Siesa
    const baseUrl = process.env.CONNEKTA_BASE_URL || "https://serviciosqa.siesacloud.com";
    let targetUrl;

    if (endpoint_type === "siesa") {
        targetUrl = `${baseUrl}/api/siesa/v3/ejecutarconsultaestandar`;
    } else {
        // Default: connekta
        targetUrl = `${baseUrl}/api/connekta/v3/ejecutarconsulta`;
    }

    // 3. Preparar Headers con las llaves SECRETAS (Solo viven en el servidor)
    const headers = {
        "conniKey": process.env.CONNEKTA_KEY,
        "conniToken": process.env.CONNEKTA_TOKEN,
        "Content-Type": "application/json"
    };

    // 4. Hacer la petición a Siesa usando Axios
    const response = await axios.get(targetUrl, {
        params: queryParams,
        headers: headers,
        timeout: 30000 // 30 segundos de timeout
    });

    // 5. Devolver la respuesta al frontend
    res.json(response.data);

  } catch (error) {
    console.error("Error en proxy Siesa:", error.message);
    
    if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        res.status(504).json({ error: "No se recibió respuesta del servidor Siesa" });
    } else {
        // Algo sucedió al configurar la petición
        res.status(500).json({ error: error.message });
    }
  }
});

// ... resto de tu servidor ...
```

## 4. Ejemplo para Vercel Serverless Function (Node.js)
Si estás usando Vercel Functions (carpeta `/api`), crea un archivo `api/siesa-proxy.js`:

```javascript
// api/siesa-proxy.js
import axios from 'axios';

export default async function handler(req, res) {
  // Habilitar CORS si es necesario (opcional, depende de tu config de vercel.json)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { endpoint_type, ...queryParams } = req.query;
  const baseUrl = process.env.CONNEKTA_BASE_URL || "https://serviciosqa.siesacloud.com";
  
  let targetUrl;
  if (endpoint_type === "siesa") {
      targetUrl = `${baseUrl}/api/siesa/v3/ejecutarconsultaestandar`;
  } else {
      targetUrl = `${baseUrl}/api/connekta/v3/ejecutarconsulta`;
  }

  try {
    const response = await axios.get(targetUrl, {
        params: queryParams,
        headers: {
            "conniKey": process.env.CONNEKTA_KEY,
            "conniToken": process.env.CONNEKTA_TOKEN,
            "Content-Type": "application/json"
        }
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: error.message };
    res.status(status).json(data);
  }
}
```

## Resumen
El frontend enviará las peticiones a tu endpoint `/siesa-proxy`. Tu servidor Node.js agregará las credenciales y reenviará la solicitud a Siesa, protegiendo así tus llaves de acceso.
