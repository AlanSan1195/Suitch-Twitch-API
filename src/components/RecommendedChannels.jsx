import { awaitStream, awaitYourFollows, awaitYourFollowsLive } from "../logic/respuesta";
import { useEffect, useState } from "react";
import { ShowmoreWhitActive } from "./Showmore";
import { TooltipColapsar, TooltipExpandir } from "./Tooltip";
import { useInitialContext } from "./SanstreamLyout";

export function RecommendedChannels() {
  const { context: isActive, setContext: setIsActive } = useInitialContext();
  const [isShow, setShow] = useState(false);
  const [streamer, setStreamer] = useState([]);
  const [yourFollows, setYourFollows] = useState([]);
  const [liveFollows, setLiveFollows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function getStreamData() {
      setLoading(true);
      try {
        const [streams, follows, liveData] = await Promise.all([
          awaitStream(),
          awaitYourFollows(),
          awaitYourFollowsLive(),
        ]);
        setStreamer(streams.slice(0, 10));
        setYourFollows(follows);
        setLiveFollows(liveData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    }
    getStreamData();
  }, []);

  const isFollowLive = (username) =>
    liveFollows.some(
      (live) => live.user_login.toLowerCase() === username.toLowerCase()
    );

  return (
    <>
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`h-screen bg-primary fixed inset-y-0 left-0 border-r border-white/[0.03] flex flex-col transition-all duration-300 ease-in-out z-40
          ${isActive ? "w-60" : "w-[72px]"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={{ top: "var(--header-height, 72px)" }}
      >
        {/* Cabecera sidebar */}
        <div className={`flex items-center px-3 py-3 ${isActive ? "justify-between" : "justify-center"}`}>
          {isActive && (
            <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase pl-1">
              Recomendados
            </span>
          )}
          <button
            onClick={() => setIsActive(!isActive)}
            className="relative flex items-center justify-center size-8 rounded-lg hover:bg-white/8 text-white/50 hover:text-white transition-all group"
            aria-label={isActive ? "Colapsar sidebar" : "Expandir sidebar"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${isActive ? "" : "rotate-180"}`}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M7 6v12" />
              <path d="M18 6l-6 6l6 6" />
            </svg>
            <div className="overflow-visible absolute z-50">
              {isActive ? <TooltipColapsar /> : <TooltipExpandir />}
            </div>
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {loading ? (
            /* Skeleton loading */
            <div className="flex flex-col gap-2 px-2 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 p-2 animate-pulse">
                  <div className="size-9 rounded-full bg-white/8 flex-shrink-0" />
                  {isActive && (
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="h-2.5 bg-white/8 rounded w-3/4" />
                      <div className="h-2 bg-white/5 rounded w-1/2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Canales recomendados */}
              <div
                className={`flex flex-col px-1.5 overflow-hidden transition-all duration-300 ${
                  isShow ? "max-h-[600px]" : "max-h-[310px]"
                }`}
              >
                {streamer.map((stream) => (
                  <a
                    key={stream.id}
                    href={`/perfiles/${stream.user_name}`}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/6 transition-colors group/item"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        className="size-9 rounded-full bg-zinc-800 object-cover"
                        src={stream.profile_image_url}
                        alt={stream.user_name}
                        loading="lazy"
                        decoding="async"
                      />
                      {/* Punto LIVE */}
                      <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-red-500 rounded-full border-2 border-primary animate-pulse" />
                    </div>
                    {isActive && (
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white/90 truncate leading-tight">
                          {stream.user_name}
                        </p>
                        <p className="text-[10px] text-white/50 truncate leading-tight mt-0.5">
                          {stream.game_name}
                        </p>
                        <p className="text-[10px] text-rose/80 font-medium mt-0.5">
                          {stream.viewer_count?.toLocaleString()} viewers
                        </p>
                      </div>
                    )}
                  </a>
                ))}
              </div>

              <ShowmoreWhitActive
                showMore={() => setShow(!isShow)}
                isActive={isActive}
                isShow={isShow}
              />

              {/* Favoritos */}
              <div className="flex flex-col mt-1 px-1.5">
                {isActive && (
                  <div className="flex items-center gap-2 px-2 pt-3 pb-2">
                    <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase">
                      Favoritos
                    </span>
                    {liveFollows.length > 0 && (
                      <span className="text-[10px] font-semibold text-rose bg-rose/10 px-1.5 py-0.5 rounded-full">
                        {liveFollows.length} en vivo
                      </span>
                    )}
                  </div>
                )}

                {yourFollows.map((follow) => {
                  const live = isFollowLive(follow.broadcaster_login || follow.login);
                  return (
                    <a
                      key={follow.id}
                      href={`/perfiles/${follow.broadcaster_login || follow.login}`}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/6 transition-colors"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          className="size-9 rounded-full bg-zinc-800 object-cover"
                          src={follow.profile_image_url}
                          alt={follow.broadcaster_login || follow.login}
                          loading="lazy"
                          decoding="async"
                        />
                        {live && (
                          <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-red-500 rounded-full border-2 border-primary animate-pulse" />
                        )}
                      </div>
                      {isActive && (
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white/90 truncate leading-tight">
                            {follow.display_name || follow.broadcaster_login || follow.login}
                          </p>
                          <p className="text-[10px] truncate leading-tight mt-0.5 text-white/50">
                            {live ? (
                              <span className="text-rose/80 font-medium">{follow.game_name}</span>
                            ) : (
                              "Offline"
                            )}
                          </p>
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Botón FAB móvil */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed bottom-6 right-5 z-50 bg-rose text-white p-3.5 rounded-full shadow-xl shadow-rose/30 hover:scale-110 active:scale-95 transition-transform"
        aria-label="Abrir menú"
      >
        {isMobileMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6l-12 12" /><path d="M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Overlay móvil */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          style={{ top: "72px" }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
