import { useEffect, useRef, useState } from "react";
import { useStream } from "../hooks/useStream";
import { useSearch } from "../hooks/useSearch";

export function Input() {
  const { search, setSearch, error } = useSearch();
  const { streams } = useStream(search);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Cargar historial de búsquedas desde localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setSearchHistory(history);
  }, []);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Guardar búsqueda en historial
  const saveToHistory = (searchTerm) => {
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    const updatedHistory = [
      searchTerm,
      ...history.filter((item) => item !== searchTerm),
    ].slice(0, 5); // Mantener solo las últimas 5 búsquedas
    
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  // Evita que el formulario recargue la página
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!search || error) return;
    
    saveToHistory(search);
    setShowSuggestions(false);
    window.location.href = `/perfiles/${search}`;
  };

  // Actualiza el estado con el valor del input
  const handleChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    setShowSuggestions(value.length >= 3);
  };

  // Manejar clic en sugerencia
  const handleSuggestionClick = (username) => {
    setSearch(username);
    setShowSuggestions(false);
    saveToHistory(username);
    window.location.href = `/perfiles/${username}`;
  };

  // Manejar foco en el input
  const handleFocus = () => {
    if (search.length >= 3) {
      setShowSuggestions(true);
    } else if (searchHistory.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Limpiar búsqueda
  const handleClear = () => {
    setSearch("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <form className="flex gap-x-2" onSubmit={handleSubmit}>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            onChange={handleChange}
            onFocus={handleFocus}
            className="w-full border-2 border-zinc-700 bg-zinc-800/50 text-white px-3 py-2 rounded-md focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all"
            value={search}
            placeholder="Buscar streamer, categoría o juego..."
            autoComplete="off"
          />
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label="Limpiar búsqueda"
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
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={!!error || !search}
          className="bg-rose shadow-md rounded-md px-4 py-2 text-sm font-semibold items-center hover:scale-105 opacity-80 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hidden md:flex transition-all"
        >
          Buscar
        </button>
      </form>

      {error && (
        <p className="text-rose font-light text-xs mt-1 animate-pulse">{error}</p>
      )}

      {/* Sugerencias de búsqueda */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {search.length < 3 && searchHistory.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs text-gray-400 border-b border-zinc-700">
                Búsquedas recientes
              </div>
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className="px-3 py-2 hover:bg-zinc-700 cursor-pointer flex items-center gap-2 text-sm transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-400"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {search.length >= 3 && streams.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs text-gray-400 border-b border-zinc-700">
                Resultados
              </div>
              {streams.map((stream) => (
                <div
                  key={stream.id}
                  onClick={() => handleSuggestionClick(stream.login)}
                  className="px-3 py-2 hover:bg-zinc-700 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <img
                    src={stream.profile_image_url || `https://unavatar.io/${stream.login}`}
                    alt={stream.display_name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {stream.display_name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {stream.description || "Sin descripción"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {search.length >= 3 && streams.length === 0 && (
            <div className="px-3 py-4 text-center text-gray-400 text-sm">
              No se encontraron resultados
            </div>
          )}
        </div>
      )}
    </div>
  );
}
