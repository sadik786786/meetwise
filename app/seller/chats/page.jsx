'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerChatList() {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chat/seller/list")
      .then(res => res.json())
      .then(data => {
        setChats(data.data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading chats...</p>;
  if (chats.length === 0) return <p className="p-6">No chats yet</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Buyer Messages</h1>

      <div className="space-y-3">
        {chats.map(chat => (
          <div
            key={chat.chat_id}
            onClick={() => router.push(`/seller/chat/${chat.chat_id}`)}
            className="border p-4 rounded cursor-pointer hover:bg-gray-50"
          >
            <div className="flex justify-between">
              <p className="font-semibold">{chat.buyer_name}</p>
              <span className="text-xs text-gray-400">
                {chat.last_message_time
                  ? new Date(chat.last_message_time).toLocaleDateString()
                  : ""}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-2 truncate">
              {chat.last_message || "No messages yet"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
