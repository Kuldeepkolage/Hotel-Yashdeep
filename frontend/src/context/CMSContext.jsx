import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const CMSContext = createContext(null);

export function CMSProvider({ children }) {
  const [cms, setCms] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCMS = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const json = await res.json();
        setCms(json?.data || null);
      }
    } catch (err) {
      console.warn("Could not load live CMS content:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCMS();
  }, [fetchCMS]);

  return (
    <CMSContext.Provider value={{ cms, loading, refreshCMS: fetchCMS }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  return context || { cms: null, loading: false, refreshCMS: () => {} };
}
