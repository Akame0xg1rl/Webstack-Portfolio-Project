import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faHeart,
  faShop,
  faShoppingBag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

function Header({ isLogged, setIsLogged, wishList, cardItem }) {
  const onLogout = () => {
    localStorage.removeItem("access_token");
    setIsLogged(false);
  };

  return (
    <header className="flex justify-between items-center py-4 fixed z-50 w-full left-0 top-0 px-6 bg-gradient-to-r from-pink-300 to-gray-300 text-black backdrop-blur-lg shadow-lg">
      <Link to={"/"} className="logo flex items-center">
        <img src="/assets/logo.png" alt="Digital Planner Logo" className="h-10 mr-3" />
        <h1 className="text-black text-2xl font-semibold tracking-tight">That Girl Planner</h1>
      </Link>
      <nav className="flex items-center space-x-6">
        {isLogged ? (
          <>
            <Link to={"/shop"} className="text-gray-700 hover:text-pink-500 transition-colors duration-200">
              <FontAwesomeIcon icon={faShop} size="lg" />
            </Link>
            <Link to={"/wishlist"} className="text-gray-700 hover:text-pink-500 transition-colors duration-200 relative">
              <FontAwesomeIcon icon={faHeart} size="lg" />
              {wishList?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishList.length}
                </span>
              )}
            </Link>
            <Link to={"/cards"} className="text-gray-700 hover:text-pink-500 transition-colors duration-200 relative">
              <FontAwesomeIcon icon={faCartShopping} size="lg" />
              {cardItem?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cardItem.length}
                </span>
              )}
            </Link>
            <Link to={"/order"} className="text-gray-700 hover:text-pink-500 transition-colors duration-200">
              <FontAwesomeIcon icon={faShoppingBag} size="lg" />
            </Link>
            <Button
              onClick={() => {
                toast({
                  className: "bg-gray-900 border border-pink-500 text-white",
                  title: "Confirm Logout",
                  description: "Are you sure you want to log out?",
                  action: (
                    <ToastAction altText="Yes" className="bg-pink-500 text-white hover:bg-pink-600" onClick={onLogout}>
                      Yes
                    </ToastAction>
                  ),
                });
              }}
              className="bg-pink-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-pink-600 transition duration-300"
            >
              Logout
            </Button>
          </>
        ) : (
          <div className="flex items-center space-x-6">
            <Link to={"/login"} className="text-gray-700 hover:text-pink-500 transition-colors duration-200">
              <FontAwesomeIcon icon={faUser} size="lg" />
            </Link>
            <Link to={"/signUp"} className="bg-pink-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-pink-600 transition duration-300">
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;

Header.propTypes = {
  isLogged: PropTypes.bool,
  setIsLogged: PropTypes.func,
  setCardItem: PropTypes.func,
  getCardData: PropTypes.func,
  wishList: PropTypes.array,
  cardItem: PropTypes.array,
};
