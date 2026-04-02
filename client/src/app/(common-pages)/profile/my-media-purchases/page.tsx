"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Receipt, Clock, CheckCircle, XCircle } from "lucide-react";
import { getMyPayments } from "@/services/payment.service";
import { getMyMediaPurchases } from "@/services/media.service";
import { MediaPurchase } from "@/types/media.types";
import { Payment } from "@/types/payment.types";


export default function UserBillingPage() {
  const [activeTab, setActiveTab] = useState<"library" | "billing">("library");
  const [purchases, setPurchases] = useState<MediaPurchase[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const purchaseData = await getMyMediaPurchases();
        const paymentData = await getMyPayments();

        console.log("paymentData", paymentData);
        console.log("purchaseData", purchaseData);

        setPurchases(purchaseData?.data || []);
        setPayments(paymentData?.data || []);
      } catch (error) {
        console.error("Failed to fetch billing data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-400">
        Loading your library...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Account & Billing</h1>
        <p className="text-gray-400">
          Manage your purchases and view your streaming access.
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="flex space-x-8 border-b border-gray-800 mb-8">
        <button
          onClick={() => setActiveTab("library")}
          className={`pb-4 text-sm font-medium transition-colors ${
            activeTab === "library"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          My Library
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`pb-4 text-sm font-medium transition-colors ${
            activeTab === "billing"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Payment History
        </button>
      </div>

      {activeTab === "library" ? (
        /* LIBRARY GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {purchases.length > 0 ? (
            purchases.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group hover:border-orange-500 transition-all"
              >
                <div className="relative">
                  <img
                    src={item.media.posterUrl || "/api/placeholder/400/600"}
                    alt={item.media.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Link
                      href={`/movies/${item.media.id}`}
                      className="bg-orange-600 p-3 rounded-full hover:scale-110 transition-transform"
                    >
                      <Play className="fill-current" size={24} />
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{item.media.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.type === "RENTAL"
                          ? "bg-purple-900/50 text-purple-300"
                          : "bg-green-900/50 text-green-300"
                      }`}
                    >
                      {item.type}
                    </span>
                    {item.expiresAt && (
                      <span className="text-[10px] text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {new Date(item.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-900 rounded-xl border border-dashed border-gray-800">
              <p className="text-gray-500">
                You haven't purchased any media yet.
              </p>
              <Link
                href="/movies"
                className="text-orange-500 mt-2 inline-block hover:underline"
              >
                Browse Movies
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* BILLING TABLE */
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-gray-400">
                      #{payment.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      ${(payment.amount / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center text-xs text-green-400">
                        <CheckCircle size={14} className="mr-1" /> Success
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <Receipt size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
