import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts?.();
  }, [fetchAllProducts]);

  return (
    <div className="min-h-screen bg-[#111827]">
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16">
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold mb-10 text-center text-[#FFB300]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Admin Dashboard
        </motion.h1>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-md font-medium text-sm sm:text-base transition-colors duration-200 shadow-md ${
                  isActive
                    ? "bg-[#FFB300] text-black"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <tab.icon className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
          {activeTab === "create" && <CreateProductForm />}
          {activeTab === "products" && <ProductsList />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
