// GET /api/twitch/users?logins=user1,user2
import type { APIRoute } from "astro";
import { getUsers } from "../../../services/twitchApi";

export const GET: APIRoute = async ({ url }) => {
  const logins = url.searchParams.get("logins");

  if (!logins) {
    return Response.json({ data: [], error: "Se requiere el parametro 'logins'" });
  }

  const usernameList = logins.split(",").filter(Boolean);
  const result = await getUsers(usernameList);
  return Response.json(result);
};
