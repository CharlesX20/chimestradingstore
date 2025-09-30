import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import GreetingBanner from "../components/GreetingBanner";

const categories = [
  { href: "/Cartons", name: "Cartons", imageUrl: "/product11.jpeg" },
  { href: "/Rolls", name: "Rolls", imageUrl: "/product12.jpeg" },
  { href: "/Packsby5", name: "Packs by 5", imageUrl: "/product20.jpeg" },
  { href: "/Packby1", name: "Pack by 1", imageUrl: "/product1.jpeg" },
  { href: "/Tinfoodsincrates", name: "Tin Foods in Crates", imageUrl: "/product15.jpeg" },
  { href: "/Tinfoodsinpieces", name: "Tin Foods in Pieces", imageUrl: "/product16.jpeg" },
  { href: "/Otherproducts", name: "Other products", imageUrl: "/product17.jpeg" },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products = [], isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <GreetingBanner />
        <div className="mx-auto max-w-6xl bg-black/50 backdrop-blur-sm rounded-2xl px-4 sm:px-8 py-8 sm:py-12">
        
          <div className="text-center mb-6">
            <h1 className="mx-auto text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#FFB300] leading-tight">
              Explore All Our Products
            </h1>

            <div className="mt-5 flex justify-center">
              <div className="relative w-36 sm:w-44 lg:w-56 h-2.5 rounded-full overflow-hidden">
                <span
                  className="absolute inset-0 block opacity-95"
                  style={{
                    background: "linear-gradient(90deg, #ED232A, #FFB300, #ED232A)",
                  }}
                  aria-hidden="true"
                />
                <span
                  className="absolute -inset-1.5 blur-xl opacity-30"
                  style={{
                    background: "linear-gradient(90deg, rgba(237,35,42,0.9), rgba(255,179,0,0.9))",
                  }}
                  aria-hidden="true"
                />
                <span
                  className="absolute left-0 top-0 h-2.5 w-20 rounded-full mix-blend-screen opacity-80 animate-pulse"
                  style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.06))" }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <p className="text-center text-base sm:text-lg text-white/90 max-w-3xl mx-auto mb-8 px-2">
            Discover the latest arrivals in exotic spices and condiments — perfect for adding a pinch of flavor to your dishes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group relative rounded-lg overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1"
              >
                <div className="flex flex-col h-full bg-gradient-to-b from-black/20 via-black/10 to-transparent p-4 sm:p-6">
                  <div className="flex-1">
                    <CategoryItem category={category} />
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(180deg, transparent, rgba(237,35,42,0.06))" }}
                />
              </div>
            ))}
          </div>

          {!isLoading && (
            <div className="mt-10">
              <FeaturedProducts featuredProducts={products} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
