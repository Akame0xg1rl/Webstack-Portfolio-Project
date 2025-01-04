import PropTypes from "prop-types";
import { badgeVariants } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "../components/ui/use-toast";
import { ToastAction } from "../components/ui/toast";

// Price formatting utility function for Moroccan MAD
const formatPrice = (price) => {
  return new Intl.NumberFormat("ar-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
  }).format(price);
};

function Cards({
  bookName,
  originalPrice,
  author,
  discountedPrice,
  imgSrc,
  imgAlt,
  badgeText,
  discountPercent,
  genre,
  click,
  _id,
  handleChangeInputValue,
  quantity,
}) {
  const [InputRef, setInputRef] = useState(quantity);

  const handleMinus = () => {
    setInputRef((prev) => Math.max(1, prev - 1)); // Prevent negative values
  };

  const handlePlus = () => {
    setInputRef((prev) => prev + 1); // Allow increasing quantity
  };

  const handleDeleteCard = () => {
    click(_id);
  };

  useEffect(() => {
    handleChangeInputValue(_id, InputRef);
  }, [InputRef]);

  // Format prices
  const formattedOriginalPrice = formatPrice(originalPrice);
  const formattedDiscountedPrice = formatPrice(discountedPrice);

  return (
    <div className="w-full sm:w-[600px] my-6 mx-auto p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all">
      <div className="relative flex items-center">
        {/* Badge */}
        <span
          className={`${badgeVariants({ variant: "destructive" })} absolute top-3 left-3 px-3 py-1 rounded-full bg-red-500 text-white`}
        >
          {badgeText}
        </span>

        {/* Image */}
        <div className="w-[180px] h-[250px] overflow-hidden rounded-lg shadow-lg">
          <img
            src={imgSrc}
            alt={imgAlt}
            className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105"
          />
        </div>

        {/* Card Details */}
        <div className="ml-6 w-full">
          <h3 className="text-2xl font-semibold text-gray-800 hover:text-pink-600 transition-colors">{bookName}</h3>
          <p className="my-2 text-lg text-gray-600 italic">by {author}</p>

          {/* Price */}
          <div className="flex gap-5 items-center text-lg font-semibold">
            <p className="text-pink-600">{formattedDiscountedPrice}</p>
            <del className="text-gray-500">{formattedOriginalPrice}</del>
            <span className="text-red-500 text-sm">({discountPercent}%)</span>
          </div>

          <h4 className="mt-2 text-gray-500">Genre: {genre}</h4>

          {/* Quantity */}
          <div className="mt-4 flex items-center gap-2 text-lg">
            Quantity:
            <Button
              variant="outline"
              className="rounded-full px-4 py-2 text-black font-semibold"
              onClick={handleMinus}
            >
              -
            </Button>
            <Input
              type="number"
              value={InputRef}
              onChange={(e) => setInputRef(Number(e.target.value))}
              className="w-16 text-center text-black font-semibold"
            />
            <Button
              variant="outline"
              className="rounded-full px-4 py-2 text-black font-semibold"
              onClick={handlePlus}
            >
              +
            </Button>
          </div>

          {/* Remove Button */}
          <div className="mt-6">
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full w-full"
              onClick={() => {
                toast({
                  className: "bg-yellow-400 text-black",
                  title: "Warning❗",
                  description: "Do you want to remove this item from your cart?",
                  action: (
                    <ToastAction
                      altText="Yes"
                      className="hover:text-black"
                      onClick={handleDeleteCard}
                    >
                      Yes
                    </ToastAction>
                  ),
                });
              }}
            >
              Remove Item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

Cards.propTypes = {
  bookName: PropTypes.string,
  originalPrice: PropTypes.number,
  author: PropTypes.string,
  discountedPrice: PropTypes.number,
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string,
  badgeText: PropTypes.string,
  discountPercent: PropTypes.number,
  quantity: PropTypes.number,
  _id: PropTypes.string,
  genre: PropTypes.string,
  click: PropTypes.func,
  handleChangeInputValue: PropTypes.func,
};

export default Cards;
