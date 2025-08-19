const axios = require('axios');

// Configure axios for your Render backend
const API_BASE_URL = 'https://test-web-qtok.onrender.com';

// Sample categories
const categories = [
  {
    name: 'Skincare',
    description: 'Nourish and protect your skin with our premium skincare products',
    slug: 'skincare',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    isFeatured: true
  },
  {
    name: 'Makeup',
    description: 'Enhance your natural beauty with our high-quality makeup collection',
    slug: 'makeup',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
    isFeatured: true
  },
  {
    name: 'Fragrances',
    description: 'Discover your signature scent with our exclusive fragrance collection',
    slug: 'fragrances',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    isFeatured: true
  },
  {
    name: 'Hair Care',
    description: 'Beautiful, healthy hair starts with proper care and quality products',
    slug: 'haircare',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400',
    isFeatured: true
  }
];

// Sample products
const products = [
  {
    name: 'Hydrating Face Moisturizer',
    description: 'Deeply hydrating moisturizer with hyaluronic acid for all skin types',
    shortDescription: '24-hour hydration with hyaluronic acid',
    price: 25.99,
    originalPrice: 32.99,
    discount: 21,
    brand: 'Lech-Fita',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400'
    ],
    mainImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    stock: 50,
    tags: ['moisturizer', 'hydrating', 'hyaluronic acid'],
    features: ['24-hour hydration', 'Non-greasy', 'Suitable for all skin types'],
    skinType: ['normal', 'dry', 'combination'],
    skinConcern: ['dryness', 'dehydration'],
    isActive: true,
    isFeatured: true,
    isNew: true
  },
  {
    name: 'Vitamin C Brightening Serum',
    description: 'Powerful vitamin C serum to brighten skin and reduce dark spots',
    shortDescription: 'Brightening serum with 20% vitamin C',
    price: 35.99,
    originalPrice: 45.99,
    discount: 22,
    brand: 'Lech-Fita',
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'
    ],
    mainImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
    stock: 30,
    tags: ['serum', 'vitamin c', 'brightening'],
    features: ['20% Vitamin C', 'Antioxidant protection', 'Brightens skin'],
    skinType: ['normal', 'dry', 'oily', 'combination'],
    skinConcern: ['dark spots', 'dullness', 'uneven skin tone'],
    isActive: true,
    isFeatured: true,
    isNew: false
  },
  {
    name: 'Matte Liquid Lipstick',
    description: 'Long-lasting matte lipstick in beautiful shades',
    shortDescription: 'Transfer-proof matte lipstick',
    price: 18.99,
    originalPrice: 24.99,
    discount: 24,
    brand: 'Lech-Fita',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'
    ],
    mainImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
    stock: 75,
    tags: ['lipstick', 'matte', 'long-lasting'],
    features: ['Transfer-proof', '8-hour wear', 'Non-drying formula'],
    isActive: true,
    isFeatured: true,
    isNew: true
  },
  {
    name: 'Luxury Perfume - Rose Garden',
    description: 'Elegant floral fragrance with notes of rose, jasmine, and vanilla',
    shortDescription: 'Floral fragrance with rose and jasmine',
    price: 89.99,
    originalPrice: 120.99,
    discount: 26,
    brand: 'Lech-Fita',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
      'https://images.unsplash.com/photo-1592945403244-b3faa74b2c98?w=400'
    ],
    mainImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    stock: 20,
    tags: ['perfume', 'floral', 'rose', 'luxury'],
    features: ['Long-lasting', 'Elegant packaging', 'Unique blend'],
    isActive: true,
    isFeatured: true,
    isNew: false
  },
  {
    name: 'Repair Hair Mask',
    description: 'Intensive repair mask for damaged and dry hair',
    shortDescription: 'Deep conditioning hair mask',
    price: 28.99,
    originalPrice: 35.99,
    discount: 19,
    brand: 'Lech-Fita',
    images: [
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400',
      'https://images.unsplash.com/photo-1552858725-2758b5fb1286?w=400'
    ],
    mainImage: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400',
    stock: 40,
    tags: ['hair mask', 'repair', 'conditioning'],
    features: ['Deep conditioning', 'Repairs damage', 'Suitable for all hair types'],
    isActive: true,
    isFeatured: true,
    isNew: true
  }
];

async function addCategories() {
  console.log('🌱 Adding categories...');
  
  for (const category of categories) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/categories`, category);
      console.log(`✅ Added category: ${category.name}`);
    } catch (error) {
      console.log(`❌ Error adding category ${category.name}:`, error.response?.data?.message || error.message);
    }
  }
}

async function addProducts() {
  console.log('🛍️ Adding products...');
  
  // First, get category IDs
  try {
    const categoriesResponse = await axios.get(`${API_BASE_URL}/api/categories`);
    const categoryMap = {};
    
    categoriesResponse.data.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });
    
    for (const product of products) {
      try {
        // Assign category based on product type
        let categoryId;
        if (product.name.includes('Moisturizer') || product.name.includes('Serum')) {
          categoryId = categoryMap['skincare'];
        } else if (product.name.includes('Lipstick')) {
          categoryId = categoryMap['makeup'];
        } else if (product.name.includes('Perfume')) {
          categoryId = categoryMap['fragrances'];
        } else if (product.name.includes('Hair')) {
          categoryId = categoryMap['haircare'];
        } else {
          categoryId = categoryMap['skincare']; // default
        }
        
        const productData = {
          ...product,
          category: categoryId
        };
        
        const response = await axios.post(`${API_BASE_URL}/api/products`, productData);
        console.log(`✅ Added product: ${product.name}`);
      } catch (error) {
        console.log(`❌ Error adding product ${product.name}:`, error.response?.data?.message || error.message);
      }
    }
  } catch (error) {
    console.log('❌ Error fetching categories:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting to populate database...');
  console.log(`📡 Using API: ${API_BASE_URL}`);
  
  await addCategories();
  await addProducts();
  
  console.log('✅ Database population completed!');
  console.log('🌐 Visit your frontend to see the products!');
}

main().catch(console.error);