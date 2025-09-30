import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = [
  "Cartons",
  "Rolls",
  "Packsby5",
  "Packby1",
  "Tinfoodsincrates",
  "Tinfoodsinpieces",
  "Otherproducts",
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [localError, setLocalError] = useState("");

  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const priceValue = Number(newProduct.price);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      setLocalError("Please enter a valid positive price.");
      return;
    }

    if (!newProduct.name.trim()) {
      setLocalError("Product name is required.");
      return;
    }

    try {
      await createProduct?.({
        ...newProduct,
        price: priceValue,
      });
      setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
    } catch (err) {
      console.error("error creating a product", err);
      setLocalError("Failed to create product. Check console for details.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct((prev) => ({ ...prev, image: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      className="bg-black/70 border border-white/6 shadow-lg rounded-lg p-6 sm:p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-[#FFB300]">Create New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/80">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="mt-1 block w-full bg-black/60 border border-white/10 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB300]/60 focus:border-[#FFB300] sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white/80">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            rows="3"
            className="mt-1 block w-full bg-black/60 border border-white/10 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB300]/60 focus:border-[#FFB300] sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-white/80">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            step="0.01"
            min="0"
            className="mt-1 block w-full bg-black/60 border border-white/10 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB300]/60 focus:border-[#FFB300] sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-white/80">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="mt-1 block w-full bg-black/60 border border-white/10 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB300]/60 focus:border-[#FFB300] sm:text-sm"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-1 flex items-center gap-3">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-black/60 py-2 px-3 border border-white/10 rounded-md shadow-sm text-sm font-medium text-white hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB300]/50 inline-flex items-center"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>

          {newProduct.image ? (
            <span className="ml-2 text-sm text-white/70">Image uploaded</span>
          ) : (
            <span className="ml-2 text-sm text-white/50">No image yet</span>
          )}
        </div>

        {localError && <p className="text-sm text-[#ED232A]">{localError}</p>}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow text-sm font-medium text-black bg-[#FFB300] hover:bg-[#e6a400] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB300]/50 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <PlusCircle className="h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
