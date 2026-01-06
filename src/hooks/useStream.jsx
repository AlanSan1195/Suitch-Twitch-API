import { useEffect, useState } from "react";
import { searchUser } from "../services/apiTwitch";

export function useStream(search) {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // No buscar si el término es vacío o muy corto
    if (!search || search.length < 3) {
      setStreams([]);
      setError(null);
      return;
    }

    const fetchStreams = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await searchUser(search);
        
        if (result.error) {
          setError(result.error);
          setStreams([]);
        } else {
          setStreams(result.data);
        }
      } catch (err) {
        console.error("Error en useStream:", err);
        setError("Error al buscar streamers");
        setStreams([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce para evitar demasiadas peticiones
    const timeoutId = setTimeout(fetchStreams, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return { streams, loading, error };
}
