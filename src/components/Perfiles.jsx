import { useEffect, useState, useRef } from "react";
import { useInitialContext } from "./SanstreamLyout";

export function PerfilUser({ user }) {
  const [streamLive, setStreamerLive] = useState(null);
  const { context: isActive } = useInitialContext();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const cacheRef = useRef(new Map());
  const lastFetchRef = useRef(0);
  const [hostname, setHostname] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setHostname(window.location.hostname);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const cacheKey = `user_${user}`;
      const now = Date.now();
      const CACHE_DURATION = 5 * 60 * 1000;

      if (cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey);
        if (now - cached.timestamp < CACHE_DURATION) {
          setStreamerLive(cached.data);
          setVideos(cached.videos || []);
          setLoading(false);
          return;
        }
      }

      if (now - lastFetchRef.current < 3000) return;
      lastFetchRef.current = now;

      try {
        setLoading(true);

        // Obtener usuario y stream en vivo en paralelo
        const [usersRes, liveRes] = await Promise.all([
          fetch(`/api/twitch/users?logins=${user}`),
          fetch(`/api/twitch/streams?userLogins=${user}`),
        ]);

        const usersResult = await usersRes.json();
        const liveResult = await liveRes.json();
        const isLive = liveResult.data.length > 0;

        if (!usersResult.data.length) {
          console.error("Usuario no encontrado");
          setLoading(false);
          return;
        }

        const userData = usersResult.data[0];
        const idUser = userData.id;

        // Obtener canal y videos en paralelo
        const [channelsRes, videosRes] = await Promise.all([
          fetch(`/api/twitch/channels?ids=${idUser}`),
          fetch(`/api/twitch/videos?userId=${idUser}&first=6`),
        ]);

        const channelsResult = await channelsRes.json();
        const videosResult = await videosRes.json();

        const channelInfo = channelsResult.data?.[0] || {};
        const vods = videosResult.data || [];

        const fullData = {
          ...userData,
          ...channelInfo,
          isLive,
          liveViewers: isLive ? liveResult.data[0].viewer_count : 0,
          liveTitle: isLive ? liveResult.data[0].title : null,
          liveGame: isLive ? liveResult.data[0].game_name : null,
          liveThumbnail: isLive
            ? liveResult.data[0].thumbnail_url.replace("{width}x{height}", "1280x720")
            : null,
        };

        cacheRef.current.set(cacheKey, { data: fullData, videos: vods, timestamp: now });
        setStreamerLive(fullData);
        setVideos(vods);
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const sidebarOffset = isActive ? "md:ml-60" : "md:ml-[72px]";

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className={`${sidebarOffset} transition-all duration-300 px-4 sm:px-6 md:px-8`}>
        {/* Skeleton iframe */}
        <div className="w-full aspect-video bg-white/5 animate-pulse rounded-xl mt-6" />
        {/* Skeleton info */}
        <div className="flex gap-4 mt-5 animate-pulse">
          <div className="size-20 rounded-full bg-white/8 flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-3 pt-2">
            <div className="h-4 bg-white/8 rounded w-1/3" />
            <div className="h-3 bg-white/5 rounded w-1/4" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!streamLive) {
    return (
      <div className={`${sidebarOffset} transition-all duration-300 flex flex-col items-center justify-center min-h-[60vh] gap-4`}>
        <div className="text-6xl opacity-30">🔍</div>
        <p className="text-white/50 text-lg font-medium">
          Usuario <span className="text-white/80">'{user}'</span> no encontrado
        </p>
      </div>
    );
  }

  /* ── Main profile ── */
  return (
    <div className={`${sidebarOffset} transition-all duration-300 flex flex-col`}>

      {/* ── Player / Offline banner ── */}
      <div className="relative w-full bg-black">
        {isClient && hostname ? (
          <iframe
            className="w-full aspect-video"
            src={`https://embed.twitch.tv/?channel=${user}&parent=${hostname}&autoplay=false`}
            allowFullScreen
            frameBorder="0"
            scrolling="no"
            title={`Stream de ${user}`}
          />
        ) : (
          <div className="w-full aspect-video bg-zinc-950 flex items-center justify-center">
            <div className="animate-spin rounded-full size-10 border-2 border-rose border-t-transparent" />
          </div>
        )}
      </div>


      

        <div className="flex items-center gap-2 mx-2 sm:mx-8 my-4">
          {streamLive.isLive ? (
            <span className="flex items-center gap-1.5 bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold px-3 py-1 rounded-full">
              <span className="size-1.5 bg-red-500 rounded-full animate-pulse" />
              EN VIVO — {streamLive.liveViewers?.toLocaleString()} espectadores
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/40 text-white/40 text-xs font-medium px-3 py-1 rounded-full">
              <span className="size-1.5 bg-white/30 rounded-full" />
              Offline
            </span>
          )}
        </div>

        {/* Avatar + nombre + stats */}
        <div className="flex items-start gap-4 mx-2 sm:mx-8">
          <img
            src={streamLive.profile_image_url}
            alt={`Avatar de ${user}`}
            className="size-16 sm:size-20 rounded-full ring-2 ring-rose/30 flex-shrink-0 bg-zinc-800"
          />
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <h1 className="font-bold text-xl sm:text-2xl text-white tracking-tight truncate">
              {streamLive.display_name || user}
            </h1>
            <div className="flex items-center gap-3 text-xs text-white/40 font-medium flex-wrap">
              <span>
                {Number(streamLive.view_count).toLocaleString()}{" "}
                <span className="font-normal">vistas totales</span>
              </span>
              {streamLive.broadcaster_language && (
                <span className="bg-white/5 border border-white/40 px-2 py-0.5 rounded">
                  {streamLive.broadcaster_language?.toUpperCase()}
                </span>
              )}
            </div>
            {streamLive.description && (
              <p className="text-xs text-white/50 leading-relaxed mt-1 line-clamp-2">
                {streamLive.description}
              </p>
            )}
          </div>
        </div>

        {/* Titulo y juego actual */}
        {(streamLive.title || streamLive.game_name) && (
          <div className="flex flex-col gap-1 pl-0 mx-2 sm:pl-24">
            {streamLive.title && (
              <p className="text-sm font-semibold text-white/80 leading-snug line-clamp-2">
                {streamLive.title}
              </p>
            )}
            {streamLive.game_name && (
              <p className="text-xs text-rose/80 font-medium">{streamLive.game_name}</p>
            )}
          </div>
      )}
      {/* Fin de titulo y juego actual */}
      {videos.length > 0 && (
        <div className="px-4 sm:px-6 md:px-8 py-6">
          <h2 className="font-bold text-base text-white/80 mb-4 tracking-tight">
            Últimos streams
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col w-full rounded-xl overflow-hidden bg-secondary border border-white/[0.04] hover:border-rose/30 shadow-sm hover:shadow-rose/10 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="relative w-full aspect-video overflow-hidden rounded-t-xl bg-zinc-900">
                  <img
                    src={video.thumbnail_url
                      .replace("%{width}", "440")
                      .replace("%{height}", "248")}
                    alt={video.title}
                    className="w-full h-full object-cover  transition-transform duration-300 ease-out"
                    loading="lazy"
                  />
                  {/* Duracion */}
                  <span className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>
                  {/* Vistas */}
                  <span className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded">
                    {Number(video.view_count).toLocaleString()} vistas
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-white/85 line-clamp-2 leading-snug">
                    {video.title}
                  </p>
                  <p className="text-[10px] text-white/40 mt-1.5">{streamLive.display_name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
