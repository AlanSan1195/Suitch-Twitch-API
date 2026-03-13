import { TooltipLives } from "./Tooltip";

export function Showmore({ showMore, isShow }) {
  return (
    <div className="flex items-center gap-3 mx-3 my-3">
      <hr className="flex-1 border-t opacity-40" />
      <button
        onClick={showMore}
        className="flex items-center gap-1.5 text-xs font-semibold text-white/40 hover:text-rose transition-colors group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${isShow ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        {isShow ? "Ver menos" : "Ver más"}
      </button>
      <hr className="flex-1 border-t  opacity-40" />
    </div>
  );
}

export function ShowmoreWhitActive({ showMore, isActive, isShow }) {
  return (
    <div className="flex items-center gap-2 mx-2 my-2">
      <hr className="flex-1 border-t opacity-40" />
      <button
        onClick={showMore}
        className="flex items-center justify-center text-white/40 hover:text-rose transition-colors group relative"
        aria-label={isShow ? "Ver menos" : "Ver más"}
      >
        {!isActive ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M0 0h24v24H0z" stroke="none" />
              <path d="m15 10 4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4zM3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <TooltipLives />
          </>
        ) : (
          <span className={`flex items-center gap-1 text-xs font-semibold transition-colors ${isShow ? "text-rose" : "text-white/40 hover:text-rose"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${isShow ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
            {isShow ? "Ver menos" : "Ver más"}
          </span>
        )}
      </button>
      <hr className="flex-1 border-t opacity-40" />
    </div>
  );
}
