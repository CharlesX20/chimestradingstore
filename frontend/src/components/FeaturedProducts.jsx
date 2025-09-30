import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const FeaturedProducts = ({ featuredProducts = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const { user } = useUserStore();

  const { addToCart } = useCartStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const maxStart = Math.max(0, featuredProducts.length - itemsPerPage);
    if (currentIndex > maxStart) setCurrentIndex(maxStart);
  }, [itemsPerPage, featuredProducts.length, currentIndex]);

  const maxStartIndex = Math.max(0, featuredProducts.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + itemsPerPage, maxStartIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= maxStartIndex;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FFB300] mb-6">
          Latest Products
        </h2>

        <div className="relative">
          <div className="overflow-hidden">
            <div
				className='flex transition-transform duration-300 ease-in-out'
				style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
			>
              {featuredProducts.map((product) => (
                <div
                  key={product._id ?? product.id ?? product.slug ?? Math.random()}
                  className="w-full flex-shrink-0 px-2"
                  style={{ width: `${100 / itemsPerPage}%` }}
                >
                  <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-white/6">
                    <div className="overflow-hidden">
                      <img
                        src={product.image ?? "/placeholder.png"}
                        alt={product.name ?? "product"}
                        className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-white">{product.name ?? "Unnamed"}</h3>
                      <p className="text-[#ED232A] font-semibold mb-4">
                        &#8358;{Number(product?.price ?? 0).toFixed(2)}
                      </p>
                    <button
                      onClick={() => {
                        if (!user) {
                          toast.error("Please login to add products to cart", { id: "auth-add-to-cart" });
                          return;
                        }
                        addToCart(product);
                      }}
                      className="w-full bg-[#FFB300] hover:bg-[#e6a400] text-black font-semibold py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            disabled={isStartDisabled}
            aria-label="Previous featured"
            className={`absolute top-1/2 -left-3 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-200 focus:outline-none ${
              isStartDisabled
                ? "bg-[#FFB300]/40 cursor-not-allowed text-black/50"
                : "bg-[#FFB300] hover:bg-[#e6a400] text-black"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isEndDisabled}
            aria-label="Next featured"
            className={`absolute top-1/2 -right-3 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-200 focus:outline-none ${
              isEndDisabled
                ? "bg-[#FFB300]/40 cursor-not-allowed text-black/50"
                : "bg-[#FFB300] hover:bg-[#e6a400] text-black"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
