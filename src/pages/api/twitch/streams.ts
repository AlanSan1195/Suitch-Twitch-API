// GET /api/twitch/streams?limit=20&language=es
// Tambien soporta: ?userLogins=user1,user2 para streams de usuarios especificos
import type { APIRoute } from "astro";
import { getStreams, getStreamsFromUsers } from "../../../services/twitchApi";

export const GET: APIRoute = async ({ url }) => {
  const userLogins = url.searchParams.get("userLogins");

  // Si se piden streams de usuarios especificos
  if (userLogins) {
    const logins = userLogins.split(",").filter(Boolean);
    const result = await getStreamsFromUsers(logins);
    return Response.json(result);
  }

  // Streams generales
  const limit = Number(url.searchParams.get("limit")) || 20;
  const language = url.searchParams.get("language") || "es";
  const result = await getStreams(limit, language);
  return Response.json(result);
};
