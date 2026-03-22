import { useState, useEffect, useRef } from "react";

 
 export function useSearch() {
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const firstInput = useRef(true);


    useEffect(() => {
      if (firstInput.current) {
        firstInput.current = search === "";
        return;
      }
      if (search.trim() === "") {
        setError("Busca algo bro");
      } else if (search.length < 3) {
        setError("Ingresa al menos 3 caracteres");
      } else {
        setError(null);

      }
    }, [search]);

    return { search, setSearch, error };
  }
