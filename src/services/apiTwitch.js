// Configuración de la API de Twitch
export const url = import.meta.env.PUBLIC_URL_TWITCH;
export const CLIENT_ID = import.meta.env.PUBLIC_TWITCH_CLIENT_ID;
export const TOKEN_API = import.meta.env.PUBLIC_TWITCH_TOKEN;
export const urlStreamer = import.meta.env.PUBLIC_URL_TWITCH_SEARCH;

// Headers reutilizables para todas las peticiones
const getHeaders = () => ({
  "Client-ID": CLIENT_ID,
  Authorization: `Bearer ${TOKEN_API}`,
});

// Validar configuración de la API
const validateAPIConfig = () => {
  if (!CLIENT_ID || !TOKEN_API) {
    throw new Error("CLIENT_ID o TOKEN_API no están configurados correctamente");
  }
};

// Manejador de errores centralizado
const handleAPIError = (error, context = "") => {
  console.error(`Error en ${context}:`, error);
  return { data: [], error: error.message };
};

// Servicio para obtener streams en vivo
export const getStreams = async (limit = 20, language = "es") => {
  try {
    validateAPIConfig();
    const response = await fetch(
      `${url}?first=${limit}&language=${language}`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data: data.data || [], error: null };
  } catch (error) {
    return handleAPIError(error, "getStreams");
  }
};

// Servicio para buscar un usuario específico
export const searchUser = async (username) => {
  try {
    validateAPIConfig();
    if (!username || username.length < 3) {
      return { data: [], error: "El nombre de usuario debe tener al menos 3 caracteres" };
    }
    
    const response = await fetch(
      `${urlStreamer}?login=${username}`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data: data.data || [], error: null };
  } catch (error) {
    return handleAPIError(error, "searchUser");
  }
};

// Servicio para obtener múltiples usuarios
export const getUsers = async (usernames = []) => {
  try {
    validateAPIConfig();
    if (!usernames.length) {
      return { data: [], error: null };
    }
    
    const loginQuery = usernames.map(user => `login=${user}`).join("&");
    const response = await fetch(
      `https://api.twitch.tv/helix/users?${loginQuery}`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data: data.data || [], error: null };
  } catch (error) {
    return handleAPIError(error, "getUsers");
  }
};

// Servicio para obtener información de canales
export const getChannels = async (broadcasterIds = []) => {
  try {
    validateAPIConfig();
    if (!broadcasterIds.length) {
      return { data: [], error: null };
    }
    
    const responses = await Promise.all(
      broadcasterIds.map(id =>
        fetch(
          `https://api.twitch.tv/helix/channels?broadcaster_id=${id}`,
          { headers: getHeaders() }
        )
      )
    );
    
    const jsonData = await Promise.all(
      responses.map(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
    );
    
    const channels = jsonData.map(item => item.data?.[0]).filter(Boolean);
    return { data: channels, error: null };
  } catch (error) {
    return handleAPIError(error, "getChannels");
  }
};

// Servicio para obtener streams de usuarios específicos
export const getStreamsFromUsers = async (usernames = []) => {
  try {
    validateAPIConfig();
    if (!usernames.length) {
      return { data: [], error: null };
    }
    
    const userLoginQuery = usernames.map(user => `user_login=${user}`).join("&");
    const response = await fetch(
      `${url}?${userLoginQuery}`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data: data.data || [], error: null };
  } catch (error) {
    return handleAPIError(error, "getStreamsFromUsers");
  }
};


