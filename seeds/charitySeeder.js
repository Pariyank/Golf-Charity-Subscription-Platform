require("dotenv").config();
const mongoose = require("mongoose");
const Charity = require("../models/Charity");

// Connect to your MongoDB Atlas (Ensure MONGO_URI is in your .env)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for Seeding..."))
  .catch(err => console.log(err));

const charities = [
  {
    name: "Green Horizon Initiative",
    description: "Dedicated to reforestation and protecting biodiversity in tropical rainforests. Our mission is to plant 10 million trees by 2030.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
    category: "Environment",
    location: "Global",
    website: "https://example.com",
    featured: true,
  },
  {
    name: "Ocean Cleanse Project",
    description: "Removing plastic waste from our oceans using advanced autonomous technology. We've already cleared 500 tons of debris.",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=1000&auto=format&fit=crop",
    category: "Environment",
    location: "Pacific Ocean",
    website: "https://example.com",
  },
  {
    name: "Code for Tomorrow",
    description: "Providing high-end technology education and coding bootcamps to underprivileged youth in urban centers.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop",
    category: "Education",
    location: "India",
    website: "https://example.com",
  },
  {
    name: "Rural Health Bridge",
    description: "Connecting remote villages with specialized healthcare through mobile clinics and advanced telemedicine platforms.",
    image: "https://images.unsplash.com/photo-1584512603390-281983f4f10a?q=80&w=1000&auto=format&fit=crop",
    category: "Healthcare",
    location: "Global South",
    website: "https://example.com",
  },
  {
    name: "The First Tee Program",
    description: "Empowering young people to build character and life skills through the game of golf. Teaching integrity on and off the course.",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1000&auto=format&fit=crop",
    category: "Youth",
    location: "USA & UK",
    website: "https://example.com",
  },
  {
    name: "Pure Stream Foundation",
    description: "Building sustainable water filtration systems in regions facing severe water scarcity and contamination.",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop",
    category: "Healthcare",
    location: "Africa",
    website: "https://example.com",
  }
];

const seedDB = async () => {
  try {
    // 1. Clear existing charities
    await Charity.deleteMany({});
    console.log("Old charities removed.");

    // 2. Insert new premium charities
    await Charity.insertMany(charities);
    console.log("Premium Charities Seeded 🌱");
    
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDB();