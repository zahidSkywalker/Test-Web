import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

const buildUnsplashGrid = (keyword) => {
  const count = 12;
  return Array.from({ length: count }).map((_, i) =>
    `https://source.unsplash.com/600x600/?${encodeURIComponent(keyword)},beauty,cosmetics&sig=${i+1}`
  );
};

const Category = () => {
  const { slug } = useParams();

  const keyword = useMemo(() => {
    const map = {
      skincare: 'skincare',
      makeup: 'makeup',
      fragrances: 'fragrance,perfume',
      haircare: 'haircare',
      bodycare: 'body care',
      tools: 'beauty tools',
    };
    return map[slug] || 'beauty products';
  }, [slug]);

  const gallery = useMemo(() => buildUnsplashGrid(keyword), [keyword]);

  const { data, isLoading, error } = useQuery(
    ['category-products', slug],
    async () => {
      const res = await axios.get(`/api/products/category/${slug}`);
      return res.data;
    },
    { enabled: !!slug }
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4 capitalize">{slug?.replace('-', ' ')}</h1>

      {/* Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {gallery.map((src, idx) => (
          <img key={idx} src={src} alt={`${slug} ${idx+1}`} className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-md" />
        ))}
      </div>

      {/* Products */}
      <h2 className="text-xl font-semibold mb-3">Products</h2>
      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-600">Failed to load products</div>}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {data.products?.map(p => (
            <a key={p._id} href={`/products/${p._id}`} className="block border border-gray-100 rounded-md hover:shadow-md transition">
              <img src={p.mainImage} alt={p.name} className="w-full h-40 sm:h-48 object-cover rounded-t-md" />
              <div className="p-3">
                <div className="text-sm text-gray-500">{p.category?.name}</div>
                <div className="font-medium text-gray-900 line-clamp-2">{p.name}</div>
                <div className="mt-1 text-gray-900">৳{p.price}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;

