// GET /api/twitch/search?login=username
import type { APIRoute } from "astro";
import { searchUser } from "../../../services/twitchApi";

export const GET: APIRoute = async ({ url }) => {
  const login = url.searchParams.get("login");

  if (!login) {
    return Response.json({ data: [], error: "Se requiere el parametro 'login'" });
  }

  const result = await searchUser(login);
  return Response.json(result);
};
