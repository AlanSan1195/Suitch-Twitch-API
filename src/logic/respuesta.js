// Orquestacion de datos — ahora usa los endpoints API del servidor
// en lugar de llamar directamente a la API de Twitch desde el cliente.

// Obtener streams recomendados en vivo con imagenes de perfil
export async function awaitStream() {
  try {
    const streamsRes = await fetch("/api/twitch/streams?limit=20&language=es");
    const streamsResult = await streamsRes.json();

    if (streamsResult.error) {
      console.error("Error al obtener streams:", streamsResult.error);
      return [];
    }

    // Obtener informacion de usuarios para tener profile_image_url
    const userLogins = streamsResult.data.map((stream) => stream.user_login);
    const usersRes = await fetch(`/api/twitch/users?logins=${userLogins.join(",")}`);
    const usersResult = await usersRes.json();

    if (usersResult.error) {
      console.error("Error al obtener usuarios:", usersResult.error);
      return streamsResult.data; // Devolver streams sin imagenes si falla
    }

    // Combinar streams con informacion de usuarios (profile_image_url)
    const streamsWithProfiles = streamsResult.data.map((stream) => {
      const userInfo = usersResult.data.find(
        (user) => user.login.toLowerCase() === stream.user_login.toLowerCase()
      );
      return {
        ...stream,
        profile_image_url: userInfo?.profile_image_url || "",
      };
    });

    return streamsWithProfiles;
  } catch (error) {
    console.error("Error en awaitStream:", error);
    return [];
  }
}

// Obtener informacion completa de tus streamers favoritos
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
    "Rubius",
  ];

  try {
    // Obtener informacion basica de los usuarios
    const usersRes = await fetch(`/api/twitch/users?logins=${favoriteStreams.join(",")}`);
    const usersResult = await usersRes.json();

    if (usersResult.error || !usersResult.data.length) {
      console.error("Error al obtener usuarios:", usersResult.error);
      return [];
    }

    const users = usersResult.data;
    const userIds = users.map((user) => user.id);

    // Obtener informacion de los canales
    const channelsRes = await fetch(`/api/twitch/channels?ids=${userIds.join(",")}`);
    const channelsResult = await channelsRes.json();

    if (channelsResult.error) {
      console.error("Error al obtener canales:", channelsResult.error);
      return users; // Devolver al menos la info basica de usuarios
    }

    // Combinar informacion de usuarios con canales
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

// Obtener streams en vivo de tus favoritos
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
    const res = await fetch(`/api/twitch/streams?userLogins=${favoriteStreams.join(",")}`);
    const result = await res.json();

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
