# Backend Siesa Proxy

Este proyecto es un backend en Node.js diseñado para ser desplegado en Vercel. Actúa como un proxy seguro para interactuar con la API de Siesa, ocultando las credenciales.

## Estructura del Proyecto

- `api/siesa-proxy.js`: La función serverless que maneja las peticiones.
- `vercel.json`: Configuración para el despliegue en Vercel.
- `package.json`: Dependencias del proyecto.

## Despliegue en Vercel

1.  Instala Vercel CLI (opcional) o conecta tu repositorio de GitHub a Vercel.
2.  Importa este proyecto en Vercel.
3.  **IMPORTANTE**: Configura las siguientes Variables de Entorno en el panel de Vercel (Settings > Environment Variables):

    - `CONNEKTA_KEY`: `c80b49b78df52a8ff6ed3ea977fae4ad`
    - `CONNEKTA_TOKEN`: (Tu token secreto)
    - `CONNEKTA_BASE_URL`: `https://serviciosqa.siesacloud.com`

## Uso Local

1.  Instala las dependencias:
    ```bash
    npm install
    ```
2.  Crea un archivo `.env` en la raíz con tus credenciales (ya incluido un ejemplo).
3.  Para probar localmente, se recomienda usar Vercel CLI:
    ```bash
    npm i -g vercel
    vercel dev
    ```
    O simplemente despliega a Vercel para probar.

## Endpoint

El endpoint estará disponible en:
`https://tu-proyecto.vercel.app/api/siesa-proxy`
o
`https://tu-proyecto.vercel.app/siesa-proxy`
