// GET /api/twitch/videos?userId=123&first=6
import type { APIRoute } from "astro";
import { getVideos } from "../../../services/twitchApi";

export const GET: APIRoute = async ({ url }) => {
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return Response.json({ data: [], error: "Se requiere el parametro 'userId'" });
  }

  const first = Number(url.searchParams.get("first")) || 6;
  const result = await getVideos(userId, first);
  return Response.json(result);
};
