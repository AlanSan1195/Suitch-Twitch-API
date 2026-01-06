import { awaitStream, awaitYourFollows, awaitYourFollowsLive } from "../logic/respuesta";
import { useEffect, useState } from "react";
import { ShowmoreWhitActive } from "./Showmore";
import { TooltipColapsar, TooltipExpandir } from "./Tooltip";
import { useInitialContext } from "./SanstreamLyout";

export function RecommendedChannels() {
  const { context: isActive, setContext: setIsActive } = useInitialContext();
  const [isShow, setShow] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [streamer, setStreamer] = useState([]);
  const [yourFollows, setYourFollows] = useState([]);
  const [liveFollows, setLiveFollows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStreamData() {
      setLoading(true);
      try {
        // Obtener streams recomendados en paralelo
        const [streams, follows, liveData] = await Promise.all([
          awaitStream(),
          awaitYourFollows(),
          awaitYourFollowsLive()
        ]);
        
        setStreamer(streams.slice(0, 10)); // Limitar a 10 recomendados
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

  function hidden() {
    setIsActive(!isActive);
  }

  function showMore() {
    setShow(!isShow);
    setIsShowing(!isShowing);
  }

  // Verificar si un follow está en vivo
  const isFollowLive = (username) => {
    return liveFollows.some(
      live => live.user_login.toLowerCase() === username.toLowerCase()
    );
  };

  return (
   
    <div
      id="recomended"
      className={`  h-screen bg-primary fixed inset-0  top-20 border-r-[2px] border-black shadow-sm shadow-white/10  text-xs flex flex-col   ${
        isActive ? "w-60" : "w-20"
      } `}
    >
      {/* //RECOMEND CHANNELS */}
      <div id="svg"
        className={` mt-2 mb-2  ${
          isActive ? "flex ml-3" : "flex justify-between items-center absolute"
        }`}
      >
        <span
          className={`${
            isActive
              ? "flex font-bold mx-2 mt-2 text-[15px] opacity-80"
              : "hidden"
          }`}
        >
          RECOMMENDED CHANNELS
        </span>
        <div
          className={`flex group mr-6 relative  ${
            isActive ? "flex mt-2 mb-3 mr-4" : "rotate-180 mt-2 mb-3 ml-7"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left-pipe hover:bg-white/10 hover:rounded-md hover:cursor-pointer"
            onClick={hidden}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M7 6v12"></path>
            <path d="M18 6l-6 6l6 6"></path>
          </svg>
          <div className=" overflow-visible absolute z-50">
            {isActive ? <TooltipColapsar /> : <TooltipExpandir />}
          </div>
        </div>
      </div>

      {loading ? (
        <div className={`flex justify-center items-center mt-10 ${isActive ? "" : "ml-2"}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <>
          <div id="channels-recommended"
            className={` flex-col   ${isActive ? " " : " mt-16  "} ${
              isShow ? "  h-[635px] overflow-y-scroll  " : " h-[310px] overflow-hidden "
            }`}
          >
            {streamer.map((stream) => (
              <div
                key={stream.id}
                className="flex p-1 cursor-pointer hover:bg-white/10 rounded-md justify-center transition-colors"
              >
                <a
                  href={`/perfiles/${stream.user_name}`}
                  className="flex items-center w-full"
                >
                  <img
                    className="size-10 rounded-full flex-shrink-0"
                    src={stream.profile_image_url}
                    alt={stream.user_name}
                  />
                  <div
                    className={`${
                      isActive
                        ? "ml-2 w-40 flex justify-between items-center"
                        : "hidden"
                    }`}
                  >
                    <div className="flex items-center text-pretty overflow-hidden">
                      <div className="flex-col min-w-0">
                        <h2 className="font-bold opacity-80 truncate">{stream.user_name}</h2>
                        <p className="font-light opacity-70 text-pretty truncate text-[10px]">
                          {stream.game_name}
                        </p>
                        <p className="text-cyan-600 font-semibold text-[10px]">
                          {stream.viewer_count?.toLocaleString()} viewers
                        </p>
                      </div>
                    </div>
                    <div className="size-2 bg-red-600 rounded-full mr-1 flex-shrink-0 animate-pulse">{""}</div>
                  </div>
                </a>
              </div>
            ))}
          </div>

          <ShowmoreWhitActive
            showMore={showMore}
            isActive={isActive}
            isShow={isShow}
          />

          {/* Sección de tus follows */}
          <div className={`${isActive ? "ml-3 mb-2" : "hidden"}`}>
            <span className="flex font-bold mx-2 mt-2 text-[13px] opacity-70">
              TUS FAVORITOS ({liveFollows.length} en vivo)
            </span>
          </div>

          <div className={` h-auto      ${isShow ? "h-full overflow-y-scroll  " : "  h-full overflow-hidden "} `}>
            {yourFollows.map((follow) => {
              const isLive = isFollowLive(follow.broadcaster_login || follow.login);
              
              return (
                <div
                  key={follow.id}
                  className="flex p-1 cursor-pointer hover:bg-white/10 rounded-md justify-center transition-colors"
                >
                  <a
                    href={`/perfiles/${follow.broadcaster_login || follow.login}`}
                    className="flex items-center w-full"
                  >
                    <img
                      className="size-10 rounded-full flex-shrink-0"
                      src={follow.profile_image_url}
                      alt={follow.broadcaster_login || follow.login}
                    />
                    <div
                      className={`${
                        isActive
                          ? "ml-2 w-40 flex justify-between items-center"
                          : "hidden"
                      }`}
                    >
                      <div className="flex items-center text-pretty overflow-hidden">
                        <div className="flex-col min-w-0">
                          <h2 className="font-bold opacity-80 truncate">
                            {follow.broadcaster_login || follow.login || follow.display_name}
                          </h2>
                          <p className="font-light opacity-70 text-pretty truncate text-[10px]">
                            {follow.game_name || "Offline"}
                          </p>
                        </div>
                      </div>
                      {isLive && (
                        <div className="size-2 bg-red-600 rounded-full mr-1 flex-shrink-0 animate-pulse">{""}</div>
                      )}
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
