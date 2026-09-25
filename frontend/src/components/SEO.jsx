import { useEffect } from "react";

const SITE_URL = "https://hotel-yashdeep.vercel.app";

const SEO = ({ title, description, path = "/" }) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    setMeta("description", description);

    let canonical = document.querySelector('link[rel="canonical"]');

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute(
      "href",
      `${SITE_URL}${path === "/" ? "/" : path}`
    );
  }, [title, description, path]);

  return null;
};

export default SEO;