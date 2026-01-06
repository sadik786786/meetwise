'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SellerSidebar from "@/app/components/SellerSidebar";

export default function SellerRequestDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/seller/requests/${id}`)
      .then(res => res.json())
      .then(res => {
        setData(res.data);
        setMessage(res.data.message || "");
        setBudget(res.data.proposed_budget || "");
        setLoading(false);
      });
  }, [id]);

  const updateRequest = async () => {
    await fetch(`/api/seller/requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, proposed_budget: budget })
    });
    alert("Request updated");
  };

  const deleteRequest = async () => {
    if (!confirm("Delete this request?")) return;

    await fetch(`/api/seller/requests/${id}`, { method: "DELETE" });
    router.push("/seller/requests");
  };

  if (loading) return <p>Loading...</p>;

  const editable = data.status === "pending";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />

      <main className="flex-1 md:ml-16 p-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">{data.title}</h1>

        <p className="text-gray-700 mb-4">{data.description}</p>

        <div className="mb-3">
          <label className="block text-sm font-medium">Your Message</label>
          <textarea
            disabled={!editable}
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Proposed Budget</label>
          <input
            disabled={!editable}
            type="number"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <p className="mb-4 font-medium">
          Status: <span className="uppercase">{data.status}</span>
        </p>

        {editable && (
          <div className="flex gap-3">
            <button
              onClick={updateRequest}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Update
            </button>

            <button
              onClick={deleteRequest}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
