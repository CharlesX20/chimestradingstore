import { useState, useEffect } from "react";
import { PlusCircle, Upload, Loader } from "lucide-react";
import toast from "react-hot-toast";
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

const EditProductForm = ({ product = {}, onSuccess = () => {}, onCancel = () => {} }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const editProduct = useProductStore((s) => s.editProduct);

  // prefill when product changes
  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      category: product.category ?? "",
      image: product.image ?? "",
    });
  }, [product]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((p) => ({ ...p, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // basic validation
    const priceValue = Number(form.price);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      setLocalError("Please enter a valid positive price.");
      return;
    }
    if (!form.name.trim()) {
      setLocalError("Product name is required.");
      return;
    }
    if (!form.category) {
      setLocalError("Please select a category.");
      return;
    }

    setLocalLoading(true);
    try {
      await editProduct(product._id, { ...form, price: priceValue });
      toast.success("Product updated");
      setLocalLoading(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      setLocalLoading(false);
      setLocalError(err?.response?.data?.error || "Failed to update product");
    }
  };

  return (
    <div className="bg-black/80 border border-white/6 rounded-lg p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[#FFB300] mb-4">Edit Product</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80">Product Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 block w-full bg-black/60 border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB300]/60"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows="3"
            className="mt-1 block w-full bg-black/60 border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB300]/60"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80">Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-1 block w-full bg-black/60 border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB300]/60"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 block w-full bg-black/60 border border-white/10 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB300]/60"
              required
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input id="edit-image-file" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
          <label
            htmlFor="edit-image-file"
            className="cursor-pointer bg-black/60 py-2 px-3 border border-white/10 rounded-md text-sm text-white inline-flex items-center"
          >
            <Upload className="h-5 w-5 mr-2" />
            Change image
          </label>
          {form.image ? (
            <span className="text-sm text-white/70">Image ready</span>
          ) : (
            <span className="text-sm text-white/50">No image</span>
          )}
        </div>

        {localError && <p className="text-sm text-[#ED232A]">{localError}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={localLoading}
            className="bg-[#FFB300] text-black px-4 py-2 rounded disabled:opacity-60 flex items-center gap-2"
          >
            {localLoading ? <Loader className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
            {localLoading ? "Saving..." : "Save changes"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-white/5 text-white px-4 py-2 rounded hover:bg-white/6"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
