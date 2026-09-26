import mongoose from "mongoose";
import dotenv from "dotenv";
import Menu from "../models/Menu.js";

dotenv.config();

const INITIAL_DISHES = [
  {
    name: "Special Chilapi Fish",
    category: "Main Course",
    price: 320,
    description: "Fresh tilapia fish marinated with traditional spices and shallow-fried until crispy and golden. Served with onion, lemon and homemade chutney.",
    image: "/images/hotel-yashdeep/chilapi.png",
    isVeg: false,
    available: true,
    isSpecial: true,
    isRecommended: true,
  },
  {
    name: "Dum Biryani",
    category: "Biryani",
    price: 340,
    description: "Fragrant basmati rice layered with aromatic spices and tender meat, slow-cooked to perfection. Served with raita and onion salad.",
    image: "/images/hotel-yashdeep/dum biryani.jpg",
    isVeg: false,
    available: true,
    isSpecial: false,
    isRecommended: true,
  },
  {
    name: "Kolhapuri Mutton",
    category: "Main Course",
    price: 360,
    description: "Slow-cooked mutton in fiery Kolhapuri masala with coconut and roasted spices.",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=1000&q=70",
    isVeg: false,
    available: true,
    isSpecial: false,
    isRecommended: true,
  },
  {
    name: "Chicken Tambda Rassa",
    category: "Main Course",
    price: 380,
    description: "Signature red Maharashtrian chicken curry — bold, smoky and unmistakable.",
    image: "/images/hotel-yashdeep/tambada.jpg",
    isVeg: false,
    available: true,
    isSpecial: true,
    isRecommended: false,
  },
  {
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 240,
    description: "Fresh cottage cheese cubes gently simmered in a silky, rich buttery tomato-cashew gravy with kasuri methi.",
    image: "/images/hotel-yashdeep/Paneer.jpg",
    isVeg: true,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
  {
    name: "Bharli Vangi",
    category: "Main Course",
    price: 200,
    description: "Baby brinjals stuffed with roasted peanut, sesame, grated coconut and traditional Maharashtrian goda masala.",
    image: "/images/hotel-yashdeep/vangi.jpg",
    isVeg: true,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
  {
    name: "Zunka Bhakri",
    category: "Main Course",
    price: 180,
    description: "Rustic spiced gram flour preparation tempered with mustard seeds, curry leaves, and served with hot jowar bhakri and thecha.",
    image: "/images/dishes/zunka-bhakri.jpg",
    isVeg: true,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
  {
    name: "Dal Tadka & Jeera Rice",
    category: "Main Course",
    price: 190,
    description: "Yellow arhar lentils tempered with golden garlic, cumin seeds, fresh coriander and pure desi ghee.",
    image: "/images/hotel-yashdeep/dal.jpg",
    isVeg: true,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
  {
    name: "Chicken Sukka",
    category: "Main Course",
    price: 280,
    description: "Country-style chicken dry-roasted with coconut shavings, crushed black pepper, caramelized onions, and authentic spices.",
    image: "/images/hotel-yashdeep/sukka.jpg",
    isVeg: false,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
  {
    name: "Mutton Sukka",
    category: "Main Course",
    price: 360,
    description: "Tender goat meat slow-cooked until dry with caramelized onion gravy, dark roast spices, garlic, and fresh coriander.",
    image: "/images/hotel-yashdeep/Mutton.png",
    isVeg: false,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
  {
    name: "Surmai Tawa Fry",
    category: "Starter",
    price: 350,
    description: "Fresh king fish steak marinated in fiery red masala, coated in crisp semolina (rava), and shallow-fried golden on tawa.",
    image: "/images/hotel-yashdeep/surmai.jpg",
    isVeg: false,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
  {
    name: "Special Kolhapuri Chicken Thali",
    category: "Main Course",
    price: 320,
    description: "Grand regional feast featuring spicy chicken curry, dry sukka chicken, tambda rassa, egg curry, fresh bhakri or chapati, and rice.",
    image: "/images/hotel-yashdeep/kolhapur.jpg",
    isVeg: false,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
  {
    name: "Kingfisher Premium",
    category: "Beer",
    price: 190,
    description: "India's iconic crisp and refreshing pale lager, served chilled. 650 ml bottle.",
    image: "/images/hotel-yashdeep/king.jpg",
    isVeg: true,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
  {
    name: "Budweiser Magnum",
    category: "Beer",
    price: 240,
    description: "Super-premium American strong lager with a full-bodied, smooth malt finish. 650 ml bottle.",
    image: "/images/hotel-yashdeep/bud.jpg",
    isVeg: true,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
  {
    name: "Heineken Premium Lager",
    category: "Beer",
    price: 260,
    description: "Smooth, perfectly balanced European lager brewed with 100% natural barley malt. 650 ml bottle.",
    image: "/images/hotel-yashdeep/hein.png",
    isVeg: true,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
  {
    name: "Corona Extra",
    category: "Beer",
    price: 320,
    description: "Chilled Mexican lager with a crisp, refreshing profile — served traditionally with a fresh wedge of lime. 330 ml.",
    image: "/images/hotel-yashdeep/corona.jpg",
    isVeg: true,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
  {
    name: "Crispy Kanda Bhaji & Chakna",
    category: "Starter",
    price: 140,
    description: "Freshly fried crunchy onion pakodas served with fried salted green chillies, roasted spiced peanuts, and crispy garlic.",
    image: "/images/hotel-yashdeep/chakna.jpg",
    isVeg: true,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
  {
    name: "Solkadhi",
    category: "Beverage",
    price: 60,
    description: "Traditional soothing Konkani and Maharashtrian digestive beverage prepared with fresh coconut milk and tangy kokum.",
    image: "/images/dishes/solkadhi.jpg",
    isVeg: true,
    available: true,
    isSpecial: false,
    isRecommended: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Remove placeholder "test" items
    await Menu.deleteMany({ name: /^test/i });

    for (const dish of INITIAL_DISHES) {
      const existing = await Menu.findOne({ name: dish.name });
      if (!existing) {
        await Menu.create(dish);
        console.log(`Created dish: ${dish.name}`);
      } else {
        console.log(`Dish already exists: ${dish.name}`);
      }
    }

    console.log("Seed complete! Current total in DB:", await Menu.countDocuments());
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
