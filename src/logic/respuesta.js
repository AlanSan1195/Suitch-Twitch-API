import { 
  getStreams, 
  getUsers, 
  getChannels, 
  getStreamsFromUsers 
} from "../services/apiTwitch";

// Obtener streams recomendados en vivo con imágenes de perfil
export async function awaitStream() {
  try {
    const result = await getStreams(20, "es");
    
    if (result.error) {
      console.error("Error al obtener streams:", result.error);
      return [];
    }
    
    // Obtener información de usuarios para tener profile_image_url
    const userLogins = result.data.map(stream => stream.user_login);
    const usersResult = await getUsers(userLogins);
    
    if (usersResult.error) {
      console.error("Error al obtener usuarios:", usersResult.error);
      return result.data; // Devolver streams sin imágenes si falla
    }
    
    // Combinar streams con información de usuarios (profile_image_url)
    const streamsWithProfiles = result.data.map(stream => {
      const userInfo = usersResult.data.find(
        user => user.login.toLowerCase() === stream.user_login.toLowerCase()
      );
      return {
        ...stream,
        profile_image_url: userInfo?.profile_image_url || ""
      };
    });
    
    return streamsWithProfiles;
  } catch (error) {
    console.error("Error en awaitStream:", error);
    return [];
  }
}

// Obtener información completa de tus streamers favoritos
export async function awaitYourFollows() {
  const favoriteStreams = [
    "GoncyPozzo",
    "illojuan",
    "ManzDev",
    "ibai",
    "Theo",
    "NateGentile7",
    "Midudev",
    "MoureDev",
  ];

  try {
    // Obtener información básica de los usuarios
    const usersResult = await getUsers(favoriteStreams);
    
    if (usersResult.error || !usersResult.data.length) {
      console.error("Error al obtener usuarios:", usersResult.error);
      return [];
    }

    const users = usersResult.data;
    const userIds = users.map(user => user.id);

    // Obtener información de los canales
    const channelsResult = await getChannels(userIds);
    
    if (channelsResult.error) {
      console.error("Error al obtener canales:", channelsResult.error);
      return users; // Devolver al menos la info básica de usuarios
    }

    // Combinar información de usuarios con canales
    const fullData = users.map((user, index) => ({
      ...user,
      ...(channelsResult.data[index] || {}),
    }));

    return fullData;
  } catch (error) {
    console.error("Error en awaitYourFollows:", error);
    return [];
  }
}

// Nueva función: Obtener streams en vivo de tus favoritos
export async function awaitYourFollowsLive() {
  const favoriteStreams = [
    "GoncyPozzo",
    "illojuan",
    "ManzDev",
    "ibai",
    "Theo",
    "NateGentile7",
    "Midudev",
    "MoureDev",
  ];

  try {
    const result = await getStreamsFromUsers(favoriteStreams);
    
    if (result.error) {
      console.error("Error al obtener streams de favoritos:", result.error);
      return [];
    }
    
    return result.data;
  } catch (error) {
    console.error("Error en awaitYourFollowsLive:", error);
    return [];
  }
}
