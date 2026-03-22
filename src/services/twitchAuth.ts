// Modulo server-side que obtiene y cachea el token client_credentials de Twitch.
// Se renueva automaticamente cuando expira. No requiere cron ni script manual.

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getTwitchToken(): Promise<string> {
  const now = Date.now();

  // Si el token existe y no ha expirado (con 5 min de margen), lo reutilizamos
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const clientId = import.meta.env.TWITCH_CLIENT_ID;
  const clientSecret = import.meta.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("TWITCH_CLIENT_ID o TWITCH_CLIENT_SECRET no estan configurados en .env.local");
  }

  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error(`Error al obtener token de Twitch: ${response.status}`);
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("La respuesta de Twitch no incluye access_token");
  }

  cachedToken = data.access_token as string;
  // expires_in viene en segundos, restamos 5 minutos de margen de seguridad
  tokenExpiresAt = now + (data.expires_in - 300) * 1000;

  return cachedToken;
}

export function getTwitchClientId(): string {
  const clientId = import.meta.env.TWITCH_CLIENT_ID;
  if (!clientId) {
    throw new Error("TWITCH_CLIENT_ID no esta configurado en .env.local");
  }
  return clientId;
}
