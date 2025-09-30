// controllers/analytics.controller.js
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

/**
 * Return basic analytics: users, products, totalSales, totalRevenue
 */
export const getAnalyticsData = async () => {
  try {
    const totalUsers = await User.countDocuments().catch(() => 0);
    const totalProducts = await Product.countDocuments().catch(() => 0);

    // Aggregate totalSales and totalRevenue (handle either totalAmount or totalPrice)
    let totalSales = 0;
    let totalRevenue = 0;

    try {
      const salesData = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: 1 },
            totalRevenue: {
              // try to sum totalAmount if present else fall back to totalPrice
              $sum: {
                $ifNull: ["$totalAmount", "$totalPrice", 0],
              },
            },
          },
        },
      ]);
      if (salesData && salesData.length > 0) {
        totalSales = salesData[0].totalSales ?? 0;
        totalRevenue = salesData[0].totalRevenue ?? 0;
      }
    } catch (err) {
      console.warn("Orders aggregation (analytics) failed:", err?.message || err);
      // leave totals as zero if aggregation fails
    }

    return {
      users: totalUsers,
      products: totalProducts,
      totalSales,
      totalRevenue,
    };
  } catch (error) {
    console.error("getAnalyticsData error:", error);
    throw error;
  }
};

/**
 * Return daily sales data in range [startDate, endDate]
 * Returns array of { name: "YYYY-MM-DD", sales: Number, revenue: Number }
 */
export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: { $ifNull: ["$totalAmount", "$totalPrice", 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build a contiguous date array and map results so missing dates show with zeroes
    const dateArray = getDatesInRange(startDate, endDate); // returns ["2025-09-01", ...]

    return dateArray.map((dateStr) => {
      const found = dailySalesData.find((d) => d._id === dateStr);
      return {
        name: dateStr, // frontend expects `name`
        sales: found?.sales ?? 0,
        revenue: found?.revenue ?? 0,
      };
    });
  } catch (error) {
    console.error("getDailySalesData error:", error);
    throw error;
  }
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  const cur = new Date(startDate);

  // normalize timezone by using toISOString split
  while (cur <= endDate) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}
