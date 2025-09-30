import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryPage = () => {
  const { fetchProductsByCategory, products = [], loading } = useProductStore();
  const { category } = useParams();

  useEffect(() => {
    if (!category) return;
    fetchProductsByCategory(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const title =
    typeof category === "string" && category.length
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : "Category";

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-extrabold text-[#FFB300] mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            {(!products || products.length === 0) && (
              <h2 className="text-3xl font-semibold text-white/70 text-center col-span-full">
                No products found
              </h2>
            )}

            {products?.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
