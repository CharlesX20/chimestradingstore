import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-hot-toast";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        if (!mounted) return;
        setAnalyticsData(response.data.analyticsData ?? analyticsData);
        setDailySalesData(response.data.dailySalesData ?? []);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch analytics");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchAnalyticsData();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Users"
          value={(analyticsData.users ?? 0).toLocaleString()}
          icon={Users}
          gradientFrom="#FFB300"
          gradientTo="#FF8A00"
        />
        <AnalyticsCard
          title="Total Products"
          value={(analyticsData.products ?? 0).toLocaleString()}
          icon={Package}
          gradientFrom="#FFB300"
          gradientTo="#ED232A"
        />
        <AnalyticsCard
          title="Total Sales"
          value={(analyticsData.totalSales ?? 0).toLocaleString()}
          icon={ShoppingCart}
          gradientFrom="#FFB300"
          gradientTo="#FF9A3C"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${(analyticsData.totalRevenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          gradientFrom="#ED232A"
          gradientTo="#FFB300"
        />
      </div>

      <motion.div
        className="bg-black/60 rounded-lg p-4 sm:p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
      >
        <div style={{ width: "100%", height: 380 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailySalesData ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" stroke="#D1D5DB" />
              <YAxis yAxisId="left" stroke="#D1D5DB" />
              <YAxis yAxisId="right" orientation="right" stroke="#D1D5DB" />
              <Tooltip wrapperStyle={{ backgroundColor: "#0b0b0b", borderRadius: 6 }} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="#ED232A"
                activeDot={{ r: 6 }}
                name="Sales"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#FFB300"
                activeDot={{ r: 6 }}
                name="Revenue"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, gradientFrom = "#FFB300", gradientTo = "#ED232A" }) => (
  <motion.div
    className="relative rounded-lg p-4 sm:p-6 overflow-hidden"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-sm mb-1 font-semibold text-white/80">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{value}</h3>
      </div>
      <div className="ml-4">
        <Icon className="h-8 w-8 text-white/20" />
      </div>
    </div>

    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        opacity: 0.06,
        pointerEvents: "none",
      }}
    />

    <div
      aria-hidden="true"
      className="absolute -bottom-6 -right-6 opacity-10"
      style={{ pointerEvents: "none" }}
    >
      <Icon className="h-24 w-24 text-white" />
    </div>
  </motion.div>
);
