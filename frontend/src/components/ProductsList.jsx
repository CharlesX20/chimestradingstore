import { useState } from "react";
import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import Modal from "./Modal";
import EditProductForm from "./EditProductForm";

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, products = [] } = useProductStore();
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <motion.div
      className="bg-black/70 shadow-lg rounded-lg overflow-hidden max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0" style={{ WebkitOverflowScrolling: "touch" }}>
        <table className="min-w-[880px] w-full divide-y divide-white/6 table-auto">
          <thead className="bg-black/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-black/50 divide-y divide-white/6">
            {products.map((product) => {
              const key = product._id ?? product.id ?? product.slug ?? Math.random();
              return (
                <tr key={key} className="hover:bg-black/40">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center min-w-[200px]">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={product.image ?? "/placeholder.png"}
                          alt={product.name ?? "product"}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{product.name ?? "Unnamed product"}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/80">${Number(product?.price ?? 0).toFixed(2)}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/70">{product?.category ?? "Uncategorized"}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleFeaturedProduct?.(product._id)}
                      className={`p-1 rounded-full transition-colors duration-200 ${
                        product?.isFeatured ? "bg-[#FFB300] text-black" : "bg-white/6 text-white/60"
                      }`}
                      aria-pressed={!!product?.isFeatured}
                      aria-label={product?.isFeatured ? "Unfeature product" : "Feature product"}
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-[#FFB300] hover:text-[#e6a400] transition-colors"
                      aria-label={`Edit ${product?.name ?? "product"}`}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct?.(product._id)}
                      className="text-[#ED232A] hover:text-[#d21d27] transition-colors"
                      aria-label={`Delete ${product?.name ?? "product"}`}
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-white/70">
                  No products available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <Modal onClose={() => setEditingProduct(null)}>
          <div className="w-full max-w-3xl mx-auto">
            <EditProductForm
              product={editingProduct}
              onSuccess={() => setEditingProduct(null)}
              onCancel={() => setEditingProduct(null)}
            />
          </div>
        </Modal>
      )}
    </motion.div>
  );
};

export default ProductsList;
