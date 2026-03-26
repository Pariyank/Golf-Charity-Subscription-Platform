require("dotenv").config();
const mongoose = require("mongoose");
const Charity = require("../models/Charity");

mongoose.connect(process.env.MONGO_URI);

const charities = [
  {
    name: "Golf for Good Foundation",
    description: "Empowering youth through sports.",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
    category: "Education",
    location: "India",
    website: "https://example.com",
    featured: true,
  },
  {
    name: "Green Earth Initiative",
    description: "Environmental conservation programs.",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    category: "Environment",
    location: "Global",
    website: "https://example.com",
  },
  {
    name: "Hope Health Trust",
    description: "Healthcare support for rural communities.",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
    category: "Healthcare",
    location: "India",
    website: "https://example.com",
  },
];

const seed = async () => {
  await Charity.deleteMany();
  await Charity.insertMany(charities);
  console.log("Charities Seeded 🌱");
  process.exit();
};

seed();