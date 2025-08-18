import React from 'react';

export default function Help() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">Help Center</h1>
      <p className="text-gray-700 mb-4">Browse FAQs or contact us for support. We aim to respond within 24 hours on business days.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Frequently Asked</h2>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Order tracking: Check “Orders” under your profile</li>
        <li>Returns & refunds: See our Returns policy</li>
        <li>Payment methods: SSLCommerz, COD, and mobile wallets</li>
      </ul>
    </div>
  );
}
