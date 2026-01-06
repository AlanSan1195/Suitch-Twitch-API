import { useInitialContext } from "./SanstreamLyout";

export function Footer() {
  const { context: isActive, setContext: setIsActive } = useInitialContext();
  return (
    <div
      id="footer"
      className={`h-auto min-h-48 flex justify-center items-center flex-col mt-7 px-4 py-8 transition-all duration-300${
        isActive ? " ml-0 md:ml-[260px]" : " ml-0 md:ml-36"
      }`}
    >
      <div className="opacity-80 text-center max-w-2xl">
        <h1 className="font-semibold text-sm sm:text-base">
          Hecho con gran motivación 🩷 Gracias a la academia de{" "}
          <a
            href="https://midu.dev"
            target="_blank"
            rel="noreferrer"
            className="relative  hover:scale-150 text-cyan-500 after:block after:w-0 after:h-[1.5px] after:rounded-lg after:bg-cyan-500 after:transition-all after:duration-300 after:absolute after:left-0 after:translate-x-1/1 after:bottom-[-3px] hover:after:w-full"
          >
            @Midudev
          </a>
        </h1>
      </div>
      <div className=" flex items-center gap-3 mt-6 group   ">
        <img
          src="/FotoPerfil.webp"
          alt="Mi foto de perfil"
          className="size-10 rounded-full hover:cursor-pointer"
        />

        <a
          href="https://alansan.pro"
          target="_blank"
          rel="noreferrer"
          className="  font-semibold opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300 "
        >
          Alan San
        </a>
      </div>
      <div
        id=" barra-contacto"
        className=" w-auto py-[5px] px-4 rounded-full flex items-center gap-2   my-5 "
      >
  
        <a
          id="github"
          className=" size-10 rounded-full flex justify-center items-center border-white/30 bg-secunday border-[1px] hover:scale-125 transition-all duration-400"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/AlanSan1195/miduch-pryect"
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
            className="icon icon-tabler icons-tabler-outline icon-tabler-brand-github opacity-80"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
          </svg>
        </a>
        <a
          id="linkedin"
          className=" size-10 rounded-full  flex justify-center items-center border-white/30 bg-secunday border-[1px] hover:scale-125 transition-all duration-400"
          target="_blank"
          rel="noreferrer"
          href="https://www.linkedin.com/in/devsan11/"

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
            className="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin opacity-80"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8 11v5" />
            <path d="M8 8v.01" />
            <path d="M12 16v-5" />
            <path d="M16 16v-3a2 2 0 1 0 -4 0" />
            <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
