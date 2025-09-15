const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const dotenv = require('dotenv');

dotenv.config();

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    status: 1,
    image: '',
    parent: null,
    description: 'TVs, gadgets, laptops and more'
  },
  {
    name: 'Vehicles',
    slug: 'vehicles',
    status: 1,
    image: '',
    parent: null,
    description: 'Vehicles'
  },
  {
    name: 'Fashion & Clothing',
    slug: 'fashion-and-clothing',
    status: 1,
    image: '',
    parent: null,
    description: 'Fashion and clothing'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    status: 1,
    image: '',
    parent: null,
    description: 'accessories'
  },
  {
    name: 'Beauty & Cosmetics',
    slug: 'beauty-and-cosmetics',
    status: 1,
    image: '',
    parent: null,
    description: 'Beauty and personal care'
  },
  {
    name: 'Furniture & Home',
    slug: 'furniture-and-home',
    status: 1,
    image: '',
    parent: null,
    description: 'Furniture & Home'
  },
  {
    name: 'Food & Drinks',
    slug: 'food-and-drinks',
    status: 1,
    image: '',
    parent: null,
    description: 'Food and drinks'
  },
  {
    name: 'Real Estate',
    slug: 'real-estate',
    status: 1,
    image: '',
    parent: null,
    description: 'Real Estate'
  }

];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Category.deleteMany();
    await Category.insertMany(categories);
    console.log('Categories seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedCategories();