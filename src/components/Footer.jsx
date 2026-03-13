import { useInitialContext } from "./SanstreamLyout";

export function Footer() {
  const { context: isActive } = useInitialContext();
  return (
    <footer
      className={` mt-12 py-10 px-6 transition-all duration-300 ${
        isActive ? "md:ml-60" : "md:ml-[72px]"
      }`}
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-5 text-center">
        {/* Créditos */}
        <p className="text-sm text-white/50 leading-relaxed">
          Hecho con motivación gracias a la academia de{" "}
          <a
            href="https://midu.dev"
            target="_blank"
            rel="noreferrer"
            className="text-rose hover:text-rose/80 font-medium transition-colors underline underline-offset-2 decoration-rose/30 hover:decoration-rose"
          >
            @Midudev
          </a>
        </p>

        {/* Autor */}
        <div className="flex items-center gap-3 group">
          <img
            src="/FotoPerfil.webp"
            alt="Alan San"
            className="size-9 rounded-full ring-2 ring-white/10 group-hover:ring-rose/30 transition-all duration-300"
          />
          <a
            href="https://alansan.pro"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
          >
            Alan San
          </a>
        </div>

        {/* Redes */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/AlanSan1195/miduch-pryect"
            target="_blank"
            rel="noreferrer"
            className="size-9 rounded-full flex items-center justify-center border border-white/10 bg-white/4 hover:bg-white/8 hover:border-white/20 text-white/60 hover:text-white transition-all duration-200"
            aria-label="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0c-2.4-1.6-3.5-1.3-3.5-1.3a4.2 4.2 0 0 0-.1 3.2a4.6 4.6 0 0 0-1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2v3.5" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/devsan11/"
            target="_blank"
            rel="noreferrer"
            className="size-9 rounded-full flex items-center justify-center border border-white/10 bg-white/4 hover:bg-white/8 hover:border-white/20 text-white/60 hover:text-white transition-all duration-200"
            aria-label="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8 11v5" />
              <path d="M8 8v.01" />
              <path d="M12 16v-5" />
              <path d="M16 16v-3a2 2 0 1 0-4 0" />
              <path d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-10a4 4 0 0 1-4-4z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
