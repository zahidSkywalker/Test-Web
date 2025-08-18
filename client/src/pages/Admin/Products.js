import React, { useEffect, useState } from 'react';
import axios from 'axios';

const defaultForm = {
  name: '',
  shortDescription: '',
  description: '',
  price: '',
  originalPrice: '',
  category: '',
  brand: '',
  stock: '',
  isFeatured: false,
  isNew: false,
  tags: '',
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchCategories = async () => {
    const res = await axios.get('/api/categories');
    setCategories(res.data);
  };

  const fetchProducts = async (p = page, q = search) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/products/admin?page=${p}&limit=20&search=${encodeURIComponent(q)}`);
      setProducts(res.data.products);
      setTotalPages(res.data.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };

  const uploadImages = async () => {
    if (images.length === 0) return [];
    const data = new FormData();
    images.forEach(f => data.append('images', f));
    const res = await axios.post('/api/products/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.urls;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const urls = await uploadImages();
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock || 0),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
        images: urls,
        mainImage: mainImage || urls[0]
      };
      const res = await axios.post('/api/products', payload);
      setForm(defaultForm);
      setImages([]);
      setMainImage('');
      setPage(1);
      await fetchProducts(1);
      alert('Product created');
    } catch (err) {
      alert(err.response?.data?.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (!window.confirm('Soft delete this product?')) return;
    await axios.delete(`/api/products/${id}`);
    await fetchProducts();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Admin Products</h1>

      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">Create Product</h2>
        <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-2">
          <input className="border p-2" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required />
          <input className="border p-2" placeholder="Short Description" value={form.shortDescription} onChange={e=>setForm(f=>({...f,shortDescription:e.target.value}))} required />
          <input className="border p-2" placeholder="Brand" value={form.brand} onChange={e=>setForm(f=>({...f,brand:e.target.value}))} />
          <input className="border p-2" placeholder="Price" type="number" step="0.01" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} required />
          <input className="border p-2" placeholder="Original Price" type="number" step="0.01" value={form.originalPrice} onChange={e=>setForm(f=>({...f,originalPrice:e.target.value}))} />
          <input className="border p-2" placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} />
          <select className="border p-2" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} required>
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={e=>setForm(f=>({...f,isFeatured:e.target.checked}))} /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isNew} onChange={e=>setForm(f=>({...f,isNew:e.target.checked}))} /> New</label>
          </div>
          <textarea className="border p-2 md:col-span-2" placeholder="Description" rows={4} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} required />
          <input className="border p-2 md:col-span-2" placeholder="Tags (comma-separated)" value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} />
          <div className="md:col-span-2">
            <label className="block mb-2">Images</label>
            <input type="file" multiple onChange={handleFileSelect} />
          </div>
          <input className="border p-2 md:col-span-2" placeholder="Main image URL (optional, else first upload is used)" value={mainImage} onChange={e=>setMainImage(e.target.value)} />
          <button disabled={saving} className="bg-black text-white px-4 py-2 rounded md:col-span-2">{saving ? 'Saving...' : 'Create Product'}</button>
        </form>
      </div>

      <div className="mb-3 flex gap-2">
        <input className="border p-2 flex-1" placeholder="Search products" value={search} onChange={e=>setSearch(e.target.value)} />
        <button className="border px-3" onClick={()=>{setPage(1); fetchProducts(1, search);}}>Search</button>
      </div>

      <div className="border rounded">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-2" colSpan="5">Loading...</td></tr>
            ) : (
              products.map(p => (
                <tr key={p._id} className="border-b">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.price}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">{p.isActive ? 'Yes' : 'No'}</td>
                  <td className="p-2">
                    <button className="text-red-600" onClick={()=>handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button className="border px-2" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1, p-1))}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button className="border px-2" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  );
};

export default AdminProducts;

