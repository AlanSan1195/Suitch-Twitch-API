import { useEffect, useState } from "react";
import { awaitStream, awaitYourFollows } from "../logic/respuesta";
import { Showmore } from "./Showmore";
import { useInitialContext } from "./SanstreamLyout";

/* Skeleton de una card */
function CardSkeleton() {
  return (
    <div className="flex flex-col w-full rounded-xl overflow-hidden bg-white/4 animate-pulse border border-white/[0.03]">
      <div className="w-full aspect-video bg-white/8" />
      <div className="p-3 flex gap-2.5">
        <div className="size-10 rounded-full bg-white/8 flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2 pt-0.5">
          <div className="h-2.5 bg-white/8 rounded w-4/5" />
          <div className="h-2 bg-white/5 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function LivesChannels() {
  const { context: isActive } = useInitialContext();
  const [showMore, setShowMore] = useState(false);
  const [streamer, setStreamer] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStream() {
      const data = await awaitStream();
      setStreamer(data);
      setLoading(false);
    }
    getStream();
  }, []);

  return (
    <div
      className={`px-4 sm:px-6 md:px-8 flex flex-col transition-all duration-300 ${
        isActive ? "md:ml-60" : "md:ml-[72px]"
      }`}
    >
      {/* Cabecera de sección */}
      <div className="flex items-center gap-3 mt-8 mb-4">
        <div className="size-2 bg-red-500 rounded-full animate-pulse" />
        <h2 className="font-bold text-lg text-white/90 tracking-tight">
          Canales en{" "}
          <span className="text-rose">vivo</span>
        </h2>
        {!loading && (
          <span className="text-xs text-white/30 font-medium bg-white/5 px-2 py-0.5 rounded-full">
            {streamer.length} streams
          </span>
        )}
      </div>

      <section
        className={`overflow-hidden transition-all duration-500 ${
          showMore ? "max-h-none" : "max-h-[480px]"
        }`}
      >
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${
            isActive
              ? "xl:grid-cols-3 2xl:grid-cols-4"
              : "xl:grid-cols-4 2xl:grid-cols-5"
          }`}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : streamer.map((stream) => (
                <a
                  href={`/perfiles/${stream.user_name}`}
                  key={stream.id}
                  className="group flex flex-col w-full rounded-xl overflow-hidden bg-secondary border border-white/[0.04] hover:border-rose/30 shadow-sm hover:shadow-rose/10 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video overflow-hidden bg-zinc-900">
                    <img
                      className="w-full h-full object-cover  transition-transform duration-300"
                      src={stream.thumbnail_url.replace("{width}x{height}", "440x248")}
                      alt={stream.title}
                      loading="lazy"
                      decoding="async"
                    />
                    {/* LIVE badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      <span className="size-1.5 bg-white rounded-full animate-pulse" />
                      EN VIVO
                    </div>
                    {/* Viewers */}
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded">
                      {stream.viewer_count?.toLocaleString()} viewers
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-start gap-2.5 px-3 pt-3 pb-2">
                    <img
                      src={stream.profile_image_url}
                      className="rounded-full size-9 flex-shrink-0 bg-zinc-800 ring-1 ring-white/10"
                      alt={stream.user_name}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="flex flex-col overflow-hidden min-w-0 flex-1 pt-0.5">
                      <p className="font-semibold text-sm text-white/90 leading-snug line-clamp-2">
                        {stream.title}
                      </p>
                      <p className="text-xs text-white/50 mt-1 truncate">{stream.user_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-3 pb-3 gap-2">
                    <p className="text-xs font-medium text-white/60 truncate">{stream.game_name}</p>
                    <span className="text-[10px] font-semibold text-white/40 bg-white/5 border border-white/8 px-2 py-0.5 rounded shrink-0">
                      {stream.language?.toUpperCase()}
                    </span>
                  </div>
                </a>
              ))}
        </div>
      </section>

      <Showmore showMore={() => setShowMore(!showMore)} isShow={showMore} />
    </div>
  );
}

export function OthersChannels() {
  const { context: isActive } = useInitialContext();
  const [showMore, setShowMore] = useState(false);
  const [streamer, setStreamer] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getOtherChannels() {
      const data = await awaitYourFollows();
      setStreamer(data);
      setLoading(false);
    }
    getOtherChannels();
  }, []);

  return (
    <div
      className={`px-4 sm:px-6 md:px-8 flex flex-col transition-all duration-300 ${
        isActive ? "md:ml-60" : "md:ml-[72px]"
      }`}
    >
      {/* Cabecera de sección */}
      <div className="flex items-center gap-3 mt-6 mb-4">
        <h2 className="font-bold text-lg text-white/90 tracking-tight">
          <span className="text-rose">Gaming</span> y{" "}
          <span className="text-rose">Desarrollo</span>
        </h2>
        {!loading && (
          <span className="text-xs text-white/30 font-medium bg-white/5 px-2 py-0.5 rounded-full">
            {streamer.length} canales
          </span>
        )}
      </div>

      <section
        className={`overflow-hidden transition-all duration-500 ${
          showMore ? "max-h-none" : "max-h-[480px]"
        }`}
      >
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${
            isActive
              ? "xl:grid-cols-3 2xl:grid-cols-4"
              : "xl:grid-cols-4 2xl:grid-cols-5"
          }`}
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          ) : streamer.length > 0 ? (
            streamer.map((stream) => (
              <a
                href={`/perfiles/${stream.login || stream.display_name}`}
                key={stream.id || stream.title}
                className="group flex flex-col w-full rounded-xl overflow-hidden bg-secondary border border-white/[0.04] hover:border-rose/30 shadow-sm hover:shadow-rose/10 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                {/* Thumbnail / offline image */}
                <div className="relative w-full aspect-video overflow-hidden bg-zinc-900">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={
                      stream.offline_image_url
                        ? stream.offline_image_url.replace("{width}x{height}", "440x248")
                        : stream.thumbnail_url
                    }
                    alt={stream.display_name || stream.login}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Info */}
                <div className="flex items-start gap-2.5 px-3 pt-3 pb-2">
                  <img
                    src={stream.profile_image_url}
                    className="rounded-full size-9 flex-shrink-0 bg-zinc-800 ring-1 ring-white/10"
                    alt={stream.display_name || stream.login}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="flex flex-col overflow-hidden min-w-0 flex-1 pt-0.5">
                    <p className="font-semibold text-sm text-white/90 leading-snug line-clamp-2">
                      {stream.title || stream.broadcaster_login || "Sin título"}
                    </p>
                    <p className="text-xs text-white/50 mt-1 truncate">
                      {stream.display_name || stream.login}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 pb-3 gap-2">
                  <p className="text-xs font-medium text-white/60 truncate">
                    {stream.game_name || "Sin categoría"}
                  </p>
                  <div className="flex gap-1 shrink-0">
                    {stream.tags?.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="text-[10px] font-medium text-white/40 bg-white/5 border border-white/8 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))
          ) : (
            <p className="text-white/40 text-sm col-span-full text-center py-8">
              No hay canales disponibles
            </p>
          )}
        </div>
      </section>

      <Showmore showMore={() => setShowMore(!showMore)} isShow={showMore} />
    </div>
  );
}
