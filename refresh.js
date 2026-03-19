import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';


dotenv.config({path: ".env.local"});

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

async function refreshToken() {
  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    })
  });

  const data = await response.json();

  if (!data.access_token) {
    console.error("No se obtuvo el token:", data);
    return;
  }

  const newToken = data.access_token;
  console.log("Nuevo token obtenido:", newToken.slice(0, 8) + "...");

  // Actualizamos el archivo .env.local
  let envContent = fs.readFileSync('.env.local', 'utf-8');
  envContent = envContent.replace(
    /TWITCH_TOKEN\s*=\s*.*/g,
    `TWITCH_TOKEN = ${newToken}`
  );
  envContent = envContent.replace(
    /PUBLIC_TWITCH_TOKEN\s*=\s*.*/g,
    `PUBLIC_TWITCH_TOKEN = ${newToken}`
  );
  fs.writeFileSync('.env.local', envContent);

  console.log('Token actualizado en .env.local');
}

refreshToken();
