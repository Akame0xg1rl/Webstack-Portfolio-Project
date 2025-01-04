import PropTypes from "prop-types";
import NewArrivals from "../components/new-arrivals";
import Footer from "../components/footer";
import { Link } from "react-router-dom";

function Home({
  wishList,
  setWishList,
  isLogged,
  isloading,
}) {
  return (
    <div className="bg-[#FFF5F7] text-black">
      {/* Navbar */}
      <header className="bg-[#000000] py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-[#FF69B4] text-2xl font-bold">MyLogo</div>
          <nav>
            <Link
              to="/shop"
              className="text-[#FFF5F7] hover:text-[#FF69B4] px-4 font-medium"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-[#FFF5F7] hover:text-[#FF69B4] px-4 font-medium"
            >
              About Us
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/assets/digital-planner-hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="z-10 text-center px-6">
          <h1 className="text-5xl font-extrabold text-[#000000] mb-6 leading-tight">
            Elevate Your Planning
          </h1>
          <p className="text-lg text-black mb-8 max-w-lg mx-auto">
            Discover premium digital planners and books crafted for productivity and style.
          </p>
          <Link
            to="/shop"
            className="bg-[#FF69B4] text-white font-bold py-3 px-8 rounded-full hover:bg-[#ff85c1] transition duration-300 text-lg"
          >
            Browse Collection
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-[#FFF5F7]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-[#FF69B4]">
            About Us
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            We are dedicated to helping you achieve your goals with our premium digital planners and books. Our mission is to inspire productivity, creativity, and organization, one page at a time.
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#FFF5F7]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-8 text-[#000000]">
            Featured Planners
          </h2>
          <NewArrivals
            isloading={isloading}
            isLogged={isLogged}
            setWishList={setWishList}
            wishList={wishList}
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-[#FFEBF0]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-8 text-[#FF69B4]">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#FFF5F7] rounded-lg shadow-lg">
              <p className="text-gray-700 italic">
                "Incredible planners! They've transformed how I organize my life."
              </p>
              <h4 className="font-bold text-[#FF69B4] mt-4">- Alex M.</h4>
            </div>
            <div className="p-6 bg-[#FFF5F7] rounded-lg shadow-lg">
              <p className="text-gray-700 italic">
                "Stylish and functional! Perfect for my daily planning needs."
              </p>
              <h4 className="font-bold text-[#FF69B4] mt-4">- Jamie D.</h4>
            </div>
            <div className="p-6 bg-[#FFF5F7] rounded-lg shadow-lg">
              <p className="text-gray-700 italic">
                "These planners are a game-changer for staying productive."
              </p>
              <h4 className="font-bold text-[#FF69B4] mt-4">- Taylor C.</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#FFF5F7]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-[#000000]">
            Plan Your Way to Success
          </h2>
          <p className="text-lg mb-8 text-gray-700">
            Join thousands of satisfied customers who plan smarter and live better.
          </p>
          <Link
            to="/shop"
            className="bg-[#FF69B4] text-white font-bold py-3 px-8 rounded-full hover:bg-[#ff85c1] transition duration-300 text-lg"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;

Home.propTypes = {
  wishList: PropTypes.array,
  setWishList: PropTypes.func,
  isLogged: PropTypes.bool,
  isloading: PropTypes.bool,
};
