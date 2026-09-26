import { SITE } from "../constants/site";

const RestaurantSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE.name,
    url: "https://hotel-yashdeep.vercel.app/",
    telephone: SITE.phone,
    email: SITE.email,
    servesCuisine: "Maharashtrian cuisine",
    menu: "https://hotel-yashdeep.vercel.app/menu",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Yedeshwari Mandir Road",
      addressLocality: "Yermala",
      addressRegion: "Maharashtra",
      postalCode: "413605",
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "11:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday", "Saturday"],
        opens: "11:00",
        closes: "00:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "10:00",
        closes: "23:00",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
};

export default RestaurantSchema;