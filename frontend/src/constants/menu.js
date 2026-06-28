export const MENU_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "veg", label: "Vegetarian" },
  { id: "nonveg", label: "Non-Vegetarian" },
  { id: "beer", label: "Beer & Bar" },
];

export const MENU_ITEMS = [
  // Vegetarian
  {
    id: 1,
    name: "Puran Poli Thali",
    category: "veg",
    price: 320,
    description:
      "Traditional sweet flatbread filled with jaggery-lentil, served with ghee, varan-bhaat and tomato saar.",
    tag: "Signature",
    image:
      "https://images.unsplash.com/photo-1604908554007-91d5b5e3f4c8?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 2,
    name: "Misal Pav",
    category: "veg",
    price: 180,
    description:
      "Spiced sprouted matki curry topped with farsan, onion and lemon. Served with soft pav.",
    tag: "Local Favourite",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 3,
    name: "Vangi Bhaat",
    category: "veg",
    price: 240,
    description:
      "Slow-cooked brinjal rice with goda masala and curry leaves — a Marathwada classic.",
    image:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 4,
    name: "Bharli Vangi",
    category: "veg",
    price: 280,
    description:
      "Baby brinjals stuffed with peanut, coconut & jaggery masala in a rich gravy.",
    image:
      "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 5,
    name: "Zunka Bhakri",
    category: "veg",
    price: 220,
    description:
      "Rustic gram flour preparation with jowar bhakri, raw onion and green chilli thecha.",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 6,
    name: "Sabudana Khichdi",
    category: "veg",
    price: 190,
    description:
      "Tapioca pearls tossed with peanuts, cumin and curry leaves. Light and aromatic.",
    image:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1000&q=70",
  },

  // Non-Vegetarian
  {
    id: 7,
    name: "Kolhapuri Mutton",
    category: "nonveg",
    price: 460,
    description:
      "Slow-cooked mutton in fiery Kolhapuri masala with coconut and roasted spices.",
    tag: "Chef's Pick",
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 8,
    name: "Chicken Tambda Rassa",
    category: "nonveg",
    price: 380,
    description:
      "Signature red Maharashtrian chicken curry — bold, smoky and unmistakable.",
    tag: "Signature",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 9,
    name: "Pandhra Rassa",
    category: "nonveg",
    price: 360,
    description:
      "Delicate white chicken curry with coconut milk, cashew and warm spices.",
    image:
      "https://images.unsplash.com/photo-1626777553635-2bb98a0bd4e0?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 10,
    name: "Sukha Mutton",
    category: "nonveg",
    price: 440,
    description:
      "Dry roasted mutton tossed with onions, garlic and crushed black pepper.",
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 11,
    name: "Fish Thali",
    category: "nonveg",
    price: 420,
    description:
      "Tawa-fried bangda, fish curry, solkadhi, rice and bhakri — a coastal classic.",
    image:
      "https://images.unsplash.com/photo-1602253057119-44d745d9b860?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 12,
    name: "Chicken Bharli Vangi",
    category: "nonveg",
    price: 400,
    description:
      "Chicken cooked with stuffed brinjal in a rich peanut-coconut gravy.",
    image:
      "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1000&q=70",
  },

  // Beer & Bar
  {
    id: 13,
    name: "Kingfisher Premium",
    category: "beer",
    price: 220,
    description: "Crisp Indian lager. 650 ml.",
    image:
      "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 14,
    name: "Bira 91 White",
    category: "beer",
    price: 260,
    description: "Cloudy Belgian-style wheat ale with citrus & coriander.",
    image:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 15,
    name: "Heineken",
    category: "beer",
    price: 320,
    description: "Smooth, balanced lager from the Netherlands. 500 ml.",
    image:
      "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 16,
    name: "Corona Extra",
    category: "beer",
    price: 380,
    description: "Light Mexican lager — served chilled with lime.",
    image:
      "https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 17,
    name: "Chakna Platter",
    category: "beer",
    price: 320,
    description:
      "House selection of masala peanuts, papad, kanda bhaji & chicken sukha bites.",
    tag: "Bar Pairing",
    image:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=70",
  },
  {
    id: 18,
    name: "Solkadhi",
    category: "beer",
    price: 90,
    description: "Cooling kokum and coconut milk digestif. Non-alcoholic.",
    image:
      "https://images.unsplash.com/photo-1571805341302-f857308690e3?auto=format&fit=crop&w=1000&q=70",
  },
];
