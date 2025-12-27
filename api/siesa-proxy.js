import axios from 'axios';

export default async function handler(req, res) {
  // Habilitar CORS
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
    const headers = {
        "conniKey": process.env.CONNEKTA_KEY,
        "conniToken": process.env.CONNEKTA_TOKEN,
        "Content-Type": "application/json"
    };

    const response = await axios.get(targetUrl, {
        params: queryParams,
        headers: headers,
        timeout: 30000 // 30 segundos de timeout
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error en proxy Siesa:", error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: error.message };
    res.status(status).json(data);
  }
}
