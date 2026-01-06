'use client';

import { useEffect, useState } from "react";
import SellerSidebar from "@/app/components/SellerSidebar";

export default function UnlockedContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seller/unlocked-contacts")
      .then(res => res.json())
      .then(data => {
        if (data.success) setContacts(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading unlocked contacts...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />

      <main className="flex-1 p-6 md:ml-16">
        <h1 className="text-2xl font-bold mb-6">Unlocked Buyer Contacts</h1>

        {contacts.length === 0 ? (
          <p className="text-gray-600">No buyers unlocked yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((buyer) => (
              <div
                key={buyer.buyer_id}
                className="bg-white border rounded-lg p-4 shadow-sm"
              >
                <h2 className="font-bold text-lg">{buyer.name}</h2>
                <p className="text-sm text-gray-600">{buyer.email}</p>
                <p className="text-sm text-gray-600">{buyer.phone}</p>

                <p className="text-xs mt-2 text-gray-500">
                  Requirement: {buyer.requirement_title || "—"}
                </p>

                <p className="text-xs text-gray-400">
                  Unlocked on {new Date(buyer.unlocked_at).toLocaleDateString()}
                </p>

                <button className="mt-3 w-full bg-green-600 text-white py-2 rounded">
                  Chat Buyer
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
