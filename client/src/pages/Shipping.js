import React from 'react';

export default function Shipping() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">Shipping Info</h1>
      <p className="text-gray-700 mb-4">We deliver nationwide across Bangladesh. Standard delivery takes 2–5 business days depending on location.</p>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Dhaka metro: 2–3 business days</li>
        <li>Chattogram, Sylhet, Rajshahi, Khulna: 3–5 business days</li>
        <li>Free shipping over ৳1000</li>
      </ul>
    </div>
  );
}
