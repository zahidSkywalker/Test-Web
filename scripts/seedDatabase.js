const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Sample data
const categories = [
  {
    name: 'Skincare',
    description: 'Nourish and protect your skin with our premium skincare products',
    slug: 'skincare',
    image: '🧴',
    isFeatured: true,
    parent: null
  },
  {
    name: 'Makeup',
    description: 'Enhance your natural beauty with our high-quality makeup collection',
    slug: 'makeup',
    image: '💄',
    isFeatured: true,
    parent: null
  },
  {
    name: 'Fragrances',
    description: 'Discover your signature scent with our exclusive fragrance collection',
    slug: 'fragrances',
    image: '🌸',
    isFeatured: true,
    parent: null
  },
  {
    name: 'Hair Care',
    description: 'Beautiful, healthy hair starts with proper care and quality products',
    slug: 'haircare',
    image: '💇‍♀️',
    isFeatured: true,
    parent: null
  },
  {
    name: 'Body Care',
    description: 'Pamper your body with luxurious body care products',
    slug: 'bodycare',
    image: '🛁',
    isFeatured: false,
    parent: null
  },
  {
    name: 'Tools & Brushes',
    description: 'Professional makeup tools and brushes for perfect application',
    slug: 'tools',
    image: '🖌️',
    isFeatured: false,
    parent: null
  }
];

const subCategories = [
  // Skincare subcategories
  {
    name: 'Cleansers',
    description: 'Gentle cleansers for all skin types',
    slug: 'cleansers',
    image: '🧼',
    isFeatured: false,
    parent: 'skincare'
  },
  {
    name: 'Moisturizers',
    description: 'Hydrating moisturizers for soft, supple skin',
    slug: 'moisturizers',
    image: '💧',
    isFeatured: false,
    parent: 'skincare'
  },
  {
    name: 'Serums',
    description: 'Concentrated treatments for specific skin concerns',
    slug: 'serums',
    image: '✨',
    isFeatured: false,
    parent: 'skincare'
  },
  {
    name: 'Sunscreen',
    description: 'Protection against harmful UV rays',
    slug: 'sunscreen',
    image: '☀️',
    isFeatured: false,
    parent: 'skincare'
  },
  
  // Makeup subcategories
  {
    name: 'Foundation',
    description: 'Flawless base makeup for perfect coverage',
    slug: 'foundation',
    image: '🎨',
    isFeatured: false,
    parent: 'makeup'
  },
  {
    name: 'Lipstick',
    description: 'Beautiful lip colors for every occasion',
    slug: 'lipstick',
    image: '💋',
    isFeatured: false,
    parent: 'makeup'
  },
  {
    name: 'Eyeshadow',
    description: 'Eye-catching colors and shimmering effects',
    slug: 'eyeshadow',
    image: '👁️',
    isFeatured: false,
    parent: 'makeup'
  },
  {
    name: 'Mascara',
    description: 'Lengthen and volumize your lashes',
    slug: 'mascara',
    image: '👁️',
    isFeatured: false,
    parent: 'makeup'
  }
];

const products = [
  // Skincare Products
  {
    name: 'Lech-Fita Hydrating Face Cleanser',
    description: 'Gentle daily cleanser that removes impurities while maintaining skin\'s natural moisture barrier. Suitable for all skin types.',
    price: 850,
    originalPrice: 1000,
    stock: 150,
    category: 'skincare',
    brand: 'Lech-Fita',
    mainImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop'
    ],
    isNew: true,
    isFeatured: true,
    onSale: true,
    rating: 4.8,
    numReviews: 127,
    skinType: ['all', 'dry', 'combination'],
    skinConcern: ['hydration', 'gentle-cleansing'],
    ingredients: ['Purified Water', 'Glycerin', 'Aloe Vera', 'Chamomile Extract'],
    weight: '200ml',
    expiryDate: '2025-12-31',
    countryOfOrigin: 'Bangladesh',
    isOrganic: true,
    isCrueltyFree: true
  },
  {
    name: 'Lech-Fita Vitamin C Brightening Serum',
    description: 'Powerful vitamin C serum that brightens skin tone, reduces dark spots, and provides antioxidant protection.',
    price: 1200,
    originalPrice: 1500,
    stock: 89,
    category: 'skincare',
    brand: 'Lech-Fita',
    mainImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
    ],
    isNew: true,
    isFeatured: true,
    onSale: true,
    rating: 4.9,
    numReviews: 203,
    skinType: ['all', 'combination', 'oily'],
    skinConcern: ['brightening', 'anti-aging', 'dark-spots'],
    ingredients: ['Vitamin C', 'Hyaluronic Acid', 'Niacinamide', 'Vitamin E'],
    weight: '30ml',
    expiryDate: '2025-12-31',
    countryOfOrigin: 'Bangladesh',
    isOrganic: false,
    isCrueltyFree: true
  },
  {
    name: 'Lech-Fita SPF 50+ Sunscreen',
    description: 'Broad-spectrum sunscreen with SPF 50+ protection. Lightweight, non-greasy formula perfect for daily use.',
    price: 950,
    originalPrice: 1200,
    stock: 200,
    category: 'skincare',
    brand: 'Lech-Fita',
    mainImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop'
    ],
    isNew: false,
    isFeatured: true,
    onSale: true,
    rating: 4.7,
    numReviews: 156,
    skinType: ['all'],
    skinConcern: ['sun-protection', 'anti-aging'],
    ingredients: ['Zinc Oxide', 'Titanium Dioxide', 'Aloe Vera', 'Vitamin E'],
    weight: '50ml',
    expiryDate: '2025-12-31',
    countryOfOrigin: 'Bangladesh',
    isOrganic: false,
    isCrueltyFree: true
  },

  // Makeup Products
  {
    name: 'Lech-Fita Long-Lasting Foundation',
    description: '24-hour long-lasting foundation with buildable coverage. Available in 20 shades for all skin tones.',
    price: 1800,
    originalPrice: 2200,
    stock: 75,
    category: 'makeup',
    brand: 'Lech-Fita',
    mainImage: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
    ],
    isNew: true,
    isFeatured: true,
    onSale: true,
    rating: 4.6,
    numReviews: 89,
    skinType: ['all'],
    skinConcern: ['coverage', 'long-lasting'],
    ingredients: ['Water', 'Dimethicone', 'Glycerin', 'Titanium Dioxide'],
    weight: '30ml',
    expiryDate: '2026-06-30',
    countryOfOrigin: 'Bangladesh',
    isOrganic: false,
    isCrueltyFree: true
  },
  {
    name: 'Lech-Fita Matte Liquid Lipstick',
    description: 'Long-wearing matte liquid lipstick that stays put for up to 8 hours. Non-drying formula with rich pigmentation.',
    price: 650,
    originalPrice: 800,
    stock: 120,
    category: 'makeup',
    brand: 'Lech-Fita',
    mainImage: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
    ],
    isNew: false,
    isFeatured: true,
    onSale: true,
    rating: 4.8,
    numReviews: 234,
    skinType: ['all'],
    skinConcern: ['long-lasting', 'matte-finish'],
    ingredients: ['Isododecane', 'Dimethicone', 'Mica', 'Iron Oxides'],
    weight: '6ml',
    expiryDate: '2026-06-30',
    countryOfOrigin: 'Bangladesh',
    isOrganic: false,
    isCrueltyFree: true
  },
  {
    name: 'Lech-Fita Pro Eyeshadow Palette',
    description: 'Professional 18-pan eyeshadow palette with matte, shimmer, and metallic finishes. Highly pigmented and blendable.',
    price: 2500,
    originalPrice: 3000,
    stock: 45,
    category: 'makeup',
    brand: 'Lech-Fita',
    mainImage: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
    ],
    isNew: true,
    isFeatured: true,
    onSale: true,
    rating: 4.9,
    numReviews: 167,
    skinType: ['all'],
    skinConcern: ['pigmentation', 'blendability'],
    ingredients: ['Mica', 'Talc', 'Boron Nitride', 'Iron Oxides'],
    weight: '25g',
    expiryDate: '2026-06-30',
    countryOfOrigin: 'Bangladesh',
    isOrganic: false,
    isCrueltyFree: true
  },

  // Fragrance Products
  {
    name: 'Lech-Fita Rose Garden Eau de Parfum',
    description: 'Elegant floral fragrance with notes of Bulgarian rose, jasmine, and white musk. Perfect for special occasions.',
    price: 3200,
    originalPrice: 4000,
    stock: 60,
    category: 'fragrances',
    brand: 'Lech-Fita',
    mainImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
    ],
    isNew: true,
    isFeatured: true,
    onSale: true,
    rating: 4.7,
    numReviews: 98,
    skinType: ['all'],
    skinConcern: ['fragrance'],
    ingredients: ['Alcohol', 'Fragrance', 'Water', 'Benzyl Benzoate'],
    weight: '50ml',
    expiryDate: '2027-12-31',
    countryOfOrigin: 'Bangladesh',
    isOrganic: false,
    isCrueltyFree: true
  },
  {
    name: 'Lech-Fita Vanilla Dreams Body Mist',
    description: 'Light and sweet vanilla body mist perfect for daily wear. Long-lasting fragrance that leaves skin feeling refreshed.',
    price: 750,
    originalPrice: 900,
    stock: 180,
    category: 'fragrances',
    brand: 'Lech-Fita',
    mainImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
    ],
    isNew: false,
    isFeatured: false,
    onSale: true,
    rating: 4.5,
    numReviews: 145,
    skinType: ['all'],
    skinConcern: ['fragrance', 'refreshment'],
    ingredients: ['Water', 'Fragrance', 'Glycerin', 'Aloe Vera'],
    weight: '100ml',
    expiryDate: '2026-12-31',
    countryOfOrigin: 'Bangladesh',
    isOrganic: false,
    isCrueltyFree: true
  },

  // Hair Care Products
  {
    name: 'Lech-Fita Argan Oil Hair Serum',
    description: 'Nourishing hair serum with pure argan oil. Repairs damaged hair, adds shine, and reduces frizz.',
    price: 1100,
    originalPrice: 1400,
    stock: 95,
    category: 'haircare',
    brand: 'Lech-Fita',
    mainImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop'
    ],
    isNew: false,
    isFeatured: true,
    onSale: true,
    rating: 4.8,
    numReviews: 178,
    skinType: ['all'],
    skinConcern: ['hair-repair', 'shine', 'frizz-control'],
    ingredients: ['Argan Oil', 'Jojoba Oil', 'Vitamin E', 'Silk Proteins'],
    weight: '100ml',
    expiryDate: '2025-12-31',
    countryOfOrigin: 'Bangladesh',
    isOrganic: true,
    isCrueltyFree: true
  }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@lech-fita.com',
    password: 'admin123',
    phone: '01712345678',
    role: 'admin',
    isVerified: true,
    address: {
      street: '123 Admin Street',
      city: 'Dhaka',
      state: 'Dhaka',
      zipCode: '1200',
      country: 'Bangladesh'
    }
  },
  {
    name: 'Test Customer',
    email: 'customer@lech-fita.com',
    password: 'customer123',
    phone: '01812345678',
    role: 'user',
    isVerified: true,
    address: {
      street: '456 Customer Avenue',
      city: 'Chittagong',
      state: 'Chittagong',
      zipCode: '4000',
      country: 'Bangladesh'
    }
  }
];

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lech-fita');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Seed categories
async function seedCategories() {
  try {
    console.log('Seeding categories...');
    
    // Clear existing categories
    await Category.deleteMany({});
    
    // Create main categories
    const createdCategories = {};
    for (const category of categories) {
      const newCategory = new Category(category);
      const savedCategory = await newCategory.save();
      createdCategories[category.slug] = savedCategory._id;
      console.log(`Created category: ${category.name}`);
    }
    
    // Create subcategories
    for (const subCategory of subCategories) {
      const parentId = createdCategories[subCategory.parent];
      if (parentId) {
        subCategory.parent = parentId;
        const newSubCategory = new Category(subCategory);
        await newSubCategory.save();
        console.log(`Created subcategory: ${subCategory.name}`);
      }
    }
    
    console.log('Categories seeded successfully!');
    return createdCategories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
}

// Seed products
async function seedProducts(categoryIds) {
  try {
    console.log('Seeding products...');
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Create products with category references
    for (const product of products) {
      const categoryId = categoryIds[product.category];
      if (categoryId) {
        product.category = categoryId;
        const newProduct = new Product(product);
        await newProduct.save();
        console.log(`Created product: ${product.name}`);
      }
    }
    
    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}

// Seed users
async function seedUsers() {
  try {
    console.log('Seeding users...');
    
    // Clear existing users
    await User.deleteMany({});
    
    // Create users with hashed passwords
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      const newUser = new User({
        ...user,
        password: hashedPassword
      });
      await newUser.save();
      console.log(`Created user: ${user.name} (${user.email})`);
    }
    
    console.log('Users seeded successfully!');
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    await connectDB();
    
    console.log('Starting database seeding...\n');
    
    // Seed in order due to dependencies
    const categoryIds = await seedCategories();
    await seedProducts(categoryIds);
    await seedUsers();
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nDefault login credentials:');
    console.log('Admin: admin@lech-fita.com / admin123');
    console.log('Customer: customer@lech-fita.com / customer123');
    
  } catch (error) {
    console.error('Database seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };