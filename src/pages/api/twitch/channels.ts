// GET /api/twitch/channels?ids=123,456
import type { APIRoute } from "astro";
import { getChannels } from "../../../services/twitchApi";

export const GET: APIRoute = async ({ url }) => {
  const ids = url.searchParams.get("ids");

  if (!ids) {
    return Response.json({ data: [], error: "Se requiere el parametro 'ids'" });
  }

  const idList = ids.split(",").filter(Boolean);
  const result = await getChannels(idList);
  return Response.json(result);
};
