import PropTypes from "prop-types";
import { instance } from "../utils/useRequest";
import { useEffect, useState, useRef } from "react";
import Card from "./card";
import { toast } from "./ui/use-toast";
import LoadingGlass from "./loading";
import { ChevronLeft, ChevronRight } from "lucide-react";

function NewArrivals({ wishList, setWishList, isLogged }) {
  const [arrivals, setArrivals] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const data = await instance.get("/newArrivalList");
      setArrivals(data.data?.newArrivalList);
      setIsLoading(false);
    })();
  }, []);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
      container.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleLikeBtnClick = async (id) => {
    if (!isLogged) {
      toast({
        variant: "destructive",
        title: "You are not registering yet!",
        description: "Please registering!",
      });
    } else {
      const el = wishList?.find((wishItem) => wishItem._id === id);
      if (!el) {
        const product = arrivals.find((arr) => arr._id === id);
        setWishList((prev) => [...prev, product]);
        await instance.patch("/wishlist", {
          productdetails: product,
        });
      } else {
        setWishList((prev) => prev.filter((wishItem) => wishItem._id !== id));
        await instance.delete("/wishlist/" + id);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="container overflow-hidden relative">
      {isloading ? (
        <div className="flex items-center justify-center w-full my-36">
          <LoadingGlass />
        </div>
      ) : (
        <>
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4 no-scrollbar relative"
          >
            <div className="flex gap-6 w-max px-4">
              {arrivals?.map((arrival) => {
                const formattedPrice = formatPrice(arrival.price);
                return (
                  <div key={arrival._id} className="w-[280px] flex-shrink-0">
                    <Card
                      {...arrival}
                      price={formattedPrice}
                      isLiked={
                        wishList?.findIndex(
                          (wishItem) => wishItem._id === arrival?._id
                        ) === -1
                      }
                      handleLikeBtnClick={handleLikeBtnClick}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={() => handleScroll('prev')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 z-10"
            aria-label="Previous items"
          >
            <ChevronLeft className="w-6 h-6 text-pink-500" />
          </button>
          
          <button 
            onClick={() => handleScroll('next')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 z-10"
            aria-label="Next items"
          >
            <ChevronRight className="w-6 h-6 text-pink-500" />
          </button>
        </>
      )}
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

NewArrivals.propTypes = {
  wishList: PropTypes.array,
  setWishList: PropTypes.func,
  isLogged: PropTypes.any,
  isloading: PropTypes.bool,
};

export default NewArrivals;