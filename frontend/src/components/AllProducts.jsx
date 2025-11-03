// src/components/AllProducts.jsx
import { useEffect, useMemo, useState, useRef } from "react";
import { Search } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";

/**
 * AllProducts
 * - Shows a centered heading "All Products"
 * - A search input (case-insensitive) above the products
 * - Debounces input so it "loads a little bit" before filtering
 * - Uses existing ProductCard for each product (no quantity controls)
 *
 * Beginner-friendly comments included.
 */
const AllProducts = () => {
  // global store (fetchAllProducts is already in useProductStore)
  const { fetchAllProducts, products = [], isLoading } = useProductStore();

  // local UI state
  const [query, setQuery] = useState("");
  const [displayedQuery, setDisplayedQuery] = useState(""); // the debounced value
  const debounceRef = useRef(null);

  // fetch all products once on mount
  useEffect(() => {
    fetchAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce the search input so results "take a little bit" to show (friendly UX)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setDisplayedQuery(query.trim());
    }, 400); // 400ms debounce

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // perform case-insensitive filtering (safe even if product fields are missing)
  const filteredProducts = useMemo(() => {
    if (!displayedQuery) return products || [];
    const q = displayedQuery.toLowerCase();
    return (products || []).filter((p) => {
      const name = (p?.name ?? "").toLowerCase();
      const desc = (p?.description ?? "").toLowerCase();
      const cat = (p?.category ?? "").toString().toLowerCase();
      return name.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [products, displayedQuery]);

  // responsive grid classes: 1 / 2 / 3 / 4 depending on width
  const gridClass =
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

  return (
    <section className="mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered heading */}
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-[#FFB300]">
          All Products
        </h2>

        {/* Search input (no description, minimal) */}
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-xl">
            <label htmlFor="all-products-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-white/60" />
              </div>
              <input
                id="all-products-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="block w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FFB300]/30"
              />
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* If there are no products at all, show a friendly message */}
            {(!products || products.length === 0) ? (
              <p className="mt-8 text-center text-white/70">No products available.</p>
            ) : (
              <>
                {/* If a search is active and no results, show message */}
                {displayedQuery && filteredProducts.length === 0 && (
                <div className="py-12 text-center">
                  <h4 className="text-xl font-semibold text-white/80">
                    No product found for "<span className="text-[#FFB300]">{displayedQuery}</span>"
                  </h4>
                  <p className="mt-2 text-white/70">Try a different search or check back later.</p>
                </div>
                )}

                {/* Product grid */}
                {filteredProducts.length > 0 && (
                  <div className={`mt-8 ${gridClass}`}>
                    {filteredProducts.map((product) => (
                      <ProductCard key={product._id ?? product.id ?? Math.random()} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AllProducts;
