import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
      toast.success("Product created");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to create product");
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      const status = error?.response?.status;
      set({ products: [], loading: false });
      if (status === 401) {
        // silently return for unauthenticated users
        return;
      }
      toast.error(error?.response?.data?.error || "Failed to fetch products");
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${encodeURIComponent(category)}`);
      const data = response.data;
      const productsList = Array.isArray(data) ? data : data.products ?? data.items ?? [];
      set({ products: productsList, loading: false });
    } catch (error) {
      const status = error?.response?.status;
      set({ products: [], loading: false });
      if (status === 401) {
        // silently return for unauthenticated users
        return;
      }
      toast.error(error?.response?.data?.error || "Failed to fetch products");
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
        loading: false,
      }));
      toast.success("Product deleted");

      // refetch featured products to ensure homepage shows fresh state
      // only call when relevant (e.g., on homepage). This is safe and forces fresh data.
      try {
        await axios.get("/products/featured"); // triggers backend and repopulates cache if cleared
        // or better: call fetchFeaturedProducts() action from store if you have it accessible
      } catch (err) {
        // ignore if fails
      }
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.error || "Failed to delete product");
    }
  },


  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      const updatedIsFeatured = response.data.isFeatured;

      set((state) => {
        // update all products list if present
        const products = state.products.map((product) =>
          product._id === productId ? { ...product, isFeatured: updatedIsFeatured } : product
        );

        // update featuredProducts: add updated item if marked featured, remove it otherwise
        let featuredProducts = Array.isArray(state.featuredProducts) ? [...state.featuredProducts] : [];

        if (updatedIsFeatured) {
          // If server returned updated product object use it, else find original and mark
          const updatedProduct = response.data._id ? response.data : products.find((p) => p._id === productId);
          const foundIndex = featuredProducts.findIndex((p) => p._id === productId);
          if (foundIndex >= 0) {
            featuredProducts[foundIndex] = { ...featuredProducts[foundIndex], ...updatedProduct, isFeatured: true };
          } else if (updatedProduct) {
            featuredProducts.unshift({ ...updatedProduct, isFeatured: true });
          }
        } else {
          featuredProducts = featuredProducts.filter((p) => p._1 !== productId && p._id !== productId);
        }

        return { products, featuredProducts, loading: false };
      });

      toast.success("Product updated");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.error || "Failed to update product");
    }
  },

  editProduct: async (productId, updatedData) => {
    set({ loading: true });
    try {
      const res = await axios.put(`/products/${productId}`, updatedData);
      const updated = res.data;
      set((state) => ({
        products: state.products.map((p) => (p._id === productId ? updated : p)),
        loading: false,
      }));
      return updated;
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.error || "Failed to update product");
      throw error;
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ featuredProducts: Array.isArray(response.data) ? response.data : [], loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.log("Error fetching featured products:", error);
    }
  },
}));
