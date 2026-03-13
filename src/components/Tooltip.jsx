export function TooltipLives() {
  return (
    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 text-white text-xs font-medium rounded-md px-2.5 py-1.5 whitespace-nowrap opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50 shadow-xl pointer-events-none">
      Canales en vivo
      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-zinc-900" />
    </div>
  );
}

export function TooltipColapsar() {
  return (
    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 text-white text-xs font-medium rounded-md px-2.5 py-1.5 whitespace-nowrap opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50 shadow-xl pointer-events-none">
      Colapsar
      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-zinc-900" />
    </div>
  );
}

export function TooltipExpandir() {
  return (
    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 text-white text-xs font-medium rounded-md px-2.5 py-1.5 whitespace-nowrap opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50 shadow-xl pointer-events-none">
      Expandir
      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-zinc-900" />
    </div>
  );
}

export function TooltipLogout() {
  return (
    <div className="absolute top-full mt-2 right-0 bg-zinc-900 border border-white/10 text-white text-xs font-medium rounded-md px-2.5 py-1.5 whitespace-nowrap opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50 shadow-xl pointer-events-none">
      Cerrar sesión
      <span className="absolute bottom-full right-3 border-4 border-transparent border-b-zinc-900" />
    </div>
  );
}
