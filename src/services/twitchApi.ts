// Servicio server-side que reemplaza a apiTwitch.js
// Todas las llamadas a Twitch pasan por aqui, usando el token auto-renovable.

import { getTwitchToken, getTwitchClientId } from "./twitchAuth";

const TWITCH_API = "https://api.twitch.tv/helix";

interface ApiResult<T = unknown[]> {
  data: T;
  error: string | null;
}

// Headers con token fresco para cada peticion
async function getHeaders(): Promise<Record<string, string>> {
  const token = await getTwitchToken();
  const clientId = getTwitchClientId();
  return {
    "Client-ID": clientId,
    Authorization: `Bearer ${token}`,
  };
}

// Manejador de errores centralizado
function handleAPIError(error: unknown, context = ""): ApiResult {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error en ${context}:`, message);
  return { data: [], error: message };
}

// Obtener streams en vivo
export async function getStreams(limit = 20, language = "es"): Promise<ApiResult> {
  try {
    const headers = await getHeaders();
    const response = await fetch(
      `${TWITCH_API}/streams?first=${limit}&language=${language}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return { data: json.data || [], error: null };
  } catch (error) {
    return handleAPIError(error, "getStreams");
  }
}

// Buscar un usuario por login
export async function searchUser(username: string): Promise<ApiResult> {
  try {
    if (!username || username.length < 3) {
      return { data: [], error: "El nombre de usuario debe tener al menos 3 caracteres" };
    }

    const headers = await getHeaders();
    const response = await fetch(
      `${TWITCH_API}/users?login=${username}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return { data: json.data || [], error: null };
  } catch (error) {
    return handleAPIError(error, "searchUser");
  }
}

// Obtener multiples usuarios por login
export async function getUsers(usernames: string[]): Promise<ApiResult> {
  try {
    if (!usernames.length) {
      return { data: [], error: null };
    }

    const headers = await getHeaders();
    const loginQuery = usernames.map((u) => `login=${u}`).join("&");
    const response = await fetch(
      `${TWITCH_API}/users?${loginQuery}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return { data: json.data || [], error: null };
  } catch (error) {
    return handleAPIError(error, "getUsers");
  }
}

// Obtener informacion de canales por broadcaster_id
export async function getChannels(broadcasterIds: string[]): Promise<ApiResult> {
  try {
    if (!broadcasterIds.length) {
      return { data: [], error: null };
    }

    const headers = await getHeaders();
    const responses = await Promise.all(
      broadcasterIds.map((id) =>
        fetch(`${TWITCH_API}/channels?broadcaster_id=${id}`, { headers })
      )
    );

    const jsonData = await Promise.all(
      responses.map((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
    );

    const channels = jsonData.map((item) => item.data?.[0]).filter(Boolean);
    return { data: channels, error: null };
  } catch (error) {
    return handleAPIError(error, "getChannels");
  }
}

// Obtener streams de usuarios especificos
export async function getStreamsFromUsers(usernames: string[]): Promise<ApiResult> {
  try {
    if (!usernames.length) {
      return { data: [], error: null };
    }

    const headers = await getHeaders();
    const userLoginQuery = usernames.map((u) => `user_login=${u}`).join("&");
    const response = await fetch(
      `${TWITCH_API}/streams?${userLoginQuery}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return { data: json.data || [], error: null };
  } catch (error) {
    return handleAPIError(error, "getStreamsFromUsers");
  }
}

// Obtener videos (VODs) de un usuario por user_id
export async function getVideos(userId: string, first = 6): Promise<ApiResult> {
  try {
    if (!userId) {
      return { data: [], error: "Se requiere userId" };
    }

    const headers = await getHeaders();
    const response = await fetch(
      `${TWITCH_API}/videos?user_id=${userId}&type=archive&first=${first}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return { data: json.data || [], error: null };
  } catch (error) {
    return handleAPIError(error, "getVideos");
  }
}
