import PropTypes from "prop-types";
import { badgeVariants } from "./ui/badge";
import { useNavigate } from "react-router-dom";

function Card({
  bookName,
  originalPrice,
  discountedPrice,
  imgSrc,
  imgAlt,
  badgeText,
  discountPercent,
  _id,
  isLiked,
  handleLikeBtnClick,
  genre,
  rating,
  currencySymbol = "MAD", // Default to "MAD" if no currency is passed
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
    handleLikeBtnClick(_id);
  };

  // Clean up the genre, remove "management" if present
  const cleanGenre = genre ? genre.replace(/management/gi, "") : "";

  // Fallback for missing author or genre
  const authorDisplay = "Unknown Author"; // Assuming you might display "Unknown Author" if no author is provided

  return (
    <div
      className="w-[250px] h-[370px] border border-pink-400 cursor-pointer p-1 bg-white shadow-lg text-black shadow-gray-400 text-center relative hover:bg-pink-100 transition-all"
      onClick={() => navigate("/product/" + _id)}
    >
      <span
        className={`${badgeVariants({
          variant: "destructive",
        })} absolute top-0 left-0 rounded-none`}
      >
        {badgeText}
      </span>
      <span onClick={handleClick} className="absolute top-2 right-2">
        {!isLiked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M16.44 3.09961C14.63 3.09961 13.01 3.97961 12 5.32961C10.99 3.97961 9.37 3.09961 7.56 3.09961C4.49 3.09961 2 5.59961 2 8.68961C2 9.87961 2.19 10.9796 2.52 11.9996C4.1 16.9996 8.97 19.9896 11.38 20.8096C11.72 20.9296 12.28 20.9296 12.62 20.8096C15.03 19.9896 19.9 16.9996 21.48 11.9996C21.81 10.9796 22 9.87961 22 8.68961C22 5.59961 19.51 3.09961 16.44 3.09961Z"
              fill="#ED3F3F"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12.62 20.8096C12.28 20.9296 11.72 20.9296 11.38 20.8096C8.48 19.8196 2 15.6896 2 8.68961C2 5.59961 4.49 3.09961 7.56 3.09961C9.38 3.09961 10.99 3.97961 12 5.33961C13.01 3.97961 14.63 3.09961 16.44 3.09961C19.51 3.09961 22 5.59961 22 8.68961C22 15.6896 15.52 19.8196 12.62 20.8096Z"
              stroke="#90A3BF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <img
        src={imgSrc}
        alt={imgAlt}
        className="w-[150px] mx-auto mt-2 h-[200px] object-contain"
      />
      <h3 className="text-lg font-semibold">{bookName}</h3>
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold text-pink-600">
          {currencySymbol} {discountedPrice}
        </p>
        <span className="text-red-500 text-[12px]">({discountPercent}%)</span>
      </div>
      <span className="text-sm text-gray-600">{cleanGenre}</span>
      <div className="text-yellow-500 mt-2">
      </div>
    </div>
  );
}

export default Card;

Card.propTypes = {
  bookName: PropTypes.string,
  originalPrice: PropTypes.number,
  discountedPrice: PropTypes.number,
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string,
  badgeText: PropTypes.string,
  discountPercent: PropTypes.number,
  _id: PropTypes.string,
  isLiked: PropTypes.any,
  handleLikeBtnClick: PropTypes.func,
  rating: PropTypes.number, // Added rating prop type
  currencySymbol: PropTypes.string, // Default is "MAD" for Moroccan Dirham
};
