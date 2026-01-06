import { useEffect, useState } from "react";
//Variables de entorno
import { awaitStream, awaitYourFollows } from "../logic/respuesta";
import { Showmore } from "./Showmore";
import { useInitialContext } from "./SanstreamLyout";

export function LivesChannels() {
  const { context: isActive, setContext: setIsActive } = useInitialContext();
  const [showMore, setShowMore] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [streamer, setStreamer] = useState([]);

  useEffect(() => {
    async function getStream() {
      const data = await awaitStream();
      setStreamer(data);
    }
    getStream();
  }, []);
  function show() {
    setShowMore(!showMore);
    setIsShow(!isShow);
  }

  return (
    <div
      id="live-channels"
      className={`px-3 sm:px-6 md:px-10 flex flex-col h-auto w-auto transition-all duration-300 ${
        isActive ? "ml-0 md:ml-64" : "ml-0 md:ml-20"
      }`}
    >
      <section
        className={` overflow-y-hidden flex flex-col  ${
          showMore ? "min-h-fit" : "max-h-[420px]"
        }`}
      >
        <div className="flex mx-1 sm:mx-3 mt-4 ">
          <p className="font-semibold text-base sm:text-lg md:text-xl opacity-85">
            <span className="font-semibold text-cyan-600  ">
              Live channels{" "}
            </span>
            we think you’ll like
          </p>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
            isActive ? "xl:grid-cols-3 2xl:grid-cols-4" : "xl:grid-cols-4 2xl:grid-cols-5"
          } gap-3 md:gap-4 overflow-y-hidden my-2 p-1 sm:p-2 ${
            showMore ? "min-h-fit" : "max-h-[500px]"
          }`}
        >
          {streamer.map((stream) => (
            <div
              className="p-2 bg-secundary bg-zinc-600/10 flex flex-col w-full h-auto border-2 border-[#232323] rounded-lg shadow-sm shadow-white/10 hover:translate-x-1 hover:-translate-y-1 md:hover:translate-x-2 md:hover:-translate-y-2 hover:bg-rose hover:border-rose transition-all duration-150"
              key={stream.id}
            >
              <a href={`/perfiles/${stream.user_name}`} className="block">
                <div className="relative w-full aspect-video rounded-md overflow-hidden bg-zinc-800">
                  <img
                    className="w-full h-full object-cover cursor-pointer"
                    src={stream.thumbnail_url.replace(
                      "{width}x{height}",
                      "440x248"
                    )}
                    alt={stream.title}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <div className="size-1.5 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                    {stream.viewer_count?.toLocaleString()} viewers
                  </div>
                </div>
                <div className="flex items-start mt-3 gap-2">
                  <img
                    src={stream.profile_image_url}
                    className="rounded-full size-10 sm:size-12 flex-shrink-0 bg-zinc-700"
                    alt={stream.user_name}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                    <p className="font-bold text-sm leading-snug line-clamp-2">
                      {stream.title}
                    </p>
                    <p className="font-light opacity-70 text-xs mt-1">
                      {stream.user_name}
                    </p>
                  </div>
                </div>
              </a>
              <div className="flex flex-col mt-2 gap-y-1 px-1">
                <p className="font-semibold opacity-80 text-xs sm:text-sm truncate">{stream.game_name}</p>
                <div className="flex items-center gap-2 text-xs opacity-70">
                  <span className="bg-zinc-700/50 px-2 py-0.5 rounded">{stream.language?.toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Showmore showMore={show} isShow={isShow} />
    </div>
  );
}

export function OthersChannels() {
  const { context: isActive, setContext: setIsActive } = useInitialContext();
  const [showMore, setShowMore] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [streamer, setStreamer] = useState([]);

  useEffect(() => {
    async function getOtherChannels() {
      const data = await awaitYourFollows();
      setStreamer(data);
    }
    getOtherChannels();
  }, []);
  function show() {
    setShowMore(!showMore);
    setIsShow(!isShow);
  }

  return (
    <div
      id="live-channels"
      className={`px-3 sm:px-6 md:px-10 flex flex-col h-auto w-auto transition-all duration-300 ${
        isActive ? "ml-0 md:ml-64" : "ml-0 md:ml-20"
      }`}
    >
      {/* esto es un componente  */}

      <section
        className={` overflow-y-hidden flex flex-col  ${
          showMore ? "min-h-fit" : "max-h-[420px]"
        }`}
      >
        <div className="flex mx-1 sm:mx-3 mt-4 ">
          <p className="font-semibold text-base sm:text-lg md:text-xl opacity-80 ">
            <span className=" text-cyan-500">Gaming</span> and{" "}
            <span className=" text-cyan-500">Development</span>
          </p>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
            isActive ? "xl:grid-cols-3 2xl:grid-cols-4" : "xl:grid-cols-4 2xl:grid-cols-5"
          } gap-3 md:gap-4 overflow-y-hidden my-2 p-1 sm:p-2 ${
            showMore ? "min-h-fit" : "max-h-[500px]"
          }`}
        >
          {streamer.length > 0 ? (
            streamer.map((stream) => (
              <div
                className="p-2 bg-secundary bg-zinc-600/10 flex flex-col w-full h-auto border-2 border-[#232323] rounded-lg shadow-sm shadow-white/10 hover:translate-x-1 hover:-translate-y-1 md:hover:translate-x-2 md:hover:-translate-y-2 hover:bg-rose hover:border-rose transition-all duration-150"
                key={stream.id || stream.title}
              >
                <a href={`/perfiles/${stream.login || stream.display_name}`} className="block">
                  <div className="relative w-full aspect-video rounded-md overflow-hidden bg-zinc-800">
                    <img
                      className="w-full h-full object-cover cursor-pointer"
                      src={
                        stream.offline_image_url
                          ? stream.offline_image_url.replace("{width}x{height}", "440x248")
                          : stream.thumbnail_url
                      }
                      alt={`Imagen de ${stream.display_name || stream.login}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex items-start mt-3 gap-2">
                    <img
                      src={stream.profile_image_url}
                      className="rounded-full size-10 sm:size-12 flex-shrink-0 bg-zinc-700"
                      alt={`Perfil de ${stream.display_name || stream.login}`}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                      <p className="font-bold text-sm leading-snug line-clamp-2">
                        {stream.title || stream.broadcaster_login || "Sin título"}
                      </p>
                      <p className="font-light opacity-70 text-xs mt-1">
                        {stream.display_name || stream.login}
                      </p>
                    </div>
                  </div>
                </a>
                <div className="flex flex-col mt-2 gap-y-2 px-1">
                  <p className="font-semibold opacity-80 text-xs sm:text-sm truncate">
                    {stream.game_name || "Sin juego"}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {stream.tags?.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-zinc-700/50 text-white text-xs px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Cargando canales</p>
          )}
        </div>
      </section>

      <Showmore showMore={show} isShow={isShow} />
    </div>
  );
}
