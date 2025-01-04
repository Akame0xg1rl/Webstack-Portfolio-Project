import PropTypes from "prop-types";
import React, { useState } from "react";
import { instance } from "../utils/useRequest";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { cartObj } from "../constants/iconsData";
import Cards from "./cards";
import LoadingGlass from "../components/loading";
import Lottie from "react-lottie";
import { Input } from "../components/ui/input";
import { toast } from "../components/ui/use-toast";

function MainCard() {
  const [dataCard, setDataCard] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoding] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: ""
  });

  const getData = async () => {
    setLoding(true);
    const data = await instance.get("/user");
    setDataCard(data.data?.user?.cart);
    setLoding(false);
  };

  useEffect(() => {
    const totalDis = dataCard?.reduce(
      (acc, curr) =>
        acc + (curr.originalPrice - curr.discountedPrice) * curr.quantity,
      0
    );
    setDiscount(totalDis);

    const sum = dataCard?.reduce(
      (acc, curr) => acc + curr.discountedPrice * curr.quantity,
      0
    );
    setTotalAmount(sum);
  }, [dataCard]);

  const click = async (id) => {
    await instance.delete("/cart/" + id);
    getData();
  };

  const handleChangeInputValue = (id, value) => {
    const newValue = dataCard.map((el) => {
      if (el._id === id) {
        el.quantity = value;
      }
      return el;
    });
    setDataCard(newValue);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate final total including delivery
      const finalTotal = (totalAmount || 0) + 50; // Default to 0 if totalAmount is null
      const finalDiscount = discount || 0; // Default to 0 if discount is null

      const response = await instance.post("/order", {
        customerInfo: formData,
        orderDetails: {
          items: dataCard.map(item => ({
            ...item,
            quantity: item.quantity || 1 // Ensure quantity is at least 1
          })),
          totalAmount: finalTotal,
          discount: finalDiscount
        },
      });

      if (response.data.status === "ok") {
        toast({
          title: "Order Placed Successfully! 🎉",
          description: "Your order has been sent and we'll process it shortly.",
          duration: 5000,
        });
        setShowOrderForm(false);
        getData(); // Refresh cart data
        setFormData({  // Reset form data
          fullName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          notes: ""
        });
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast({
        title: "Error ❌",
        description: error.response?.data?.message || "Failed to place order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container mt-28 mb-5 text-black">
      {!loading ? (
        <>
          <h1 className="text-center my-7 text-3xl text-black">
            {dataCard?.length} items in Cards
          </h1>
          <React.Fragment>
            {dataCard?.length ? (
              <div className="flex gap-20">
                <div className="flex flex-col">
                  {dataCard?.map((card) => (
                    <Cards
                      key={card._id}
                      {...card}
                      click={click}
                      handleChangeInputValue={handleChangeInputValue}
                    />
                  ))}
                </div>
                <div className="border rounded-md w-[550px] h-fit p-6 shadow-md shadow-gray-400">
                  <h3 className="text-3xl border-b-4 text-center pb-4">
                    Bill Details
                  </h3>
                  <div className="flex flex-col p-6 gap-3 border-b-4">
                    {dataCard?.map((el) => {
                      return (
                        <div
                          key={el._id}
                          className="flex items-center justify-between text-lg"
                        >
                          <h4>{el.bookName}</h4>
                          <p>X{el.quantity}</p>
                          <span>MAD {el.quantity * el.discountedPrice}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-b-4 p-6">
                    <div className="pb-3 flex justify-between items-center text-lg">
                      <h4>Discount</h4>
                      <span>MAD {discount}</span>
                    </div>
                    <div className="pt-3 flex justify-between text-lg">
                      <h4>Delivery Charges</h4>
                      <span>MAD 50</span>
                    </div>
                  </div>
                  <div className="border-b-4 p-6 flex justify-between items-center font-[600] text-lg">
                    <h4>Total Charges</h4>
                    <span>MAD {totalAmount + 50}</span>
                  </div>
                  <Button 
                    className="mt-5 w-full bg-green-500 hover:bg-green-700 active:scale-95 transition-all"
                    onClick={() => setShowOrderForm(true)}
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <Lottie
                  options={cartObj}
                  height={160}
                  width={160}
                  isStopped={false}
                  isPaused={false}
                />
                <h1 className="flex items-center justify-center text-4xl mt-5 w-full text-red-500">
                  Your Card is Empty!
                </h1>
                <div className="flex items-center justify-center mt-5 w-full">
                  <Button className="bg-red-500 hover:bg-red-700">
                    <Link to={"/shop"}>Go to Shop</Link>
                  </Button>
                </div>
              </div>
            )}
          </React.Fragment>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full mt-80">
          <LoadingGlass />
        </div>
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Order Details</h2>
            
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  placeholder="Enter your full name"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Enter your phone number"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <Input
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  placeholder="Enter your delivery address"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleFormChange}
                  placeholder="Enter your city"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <Input
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  placeholder="Any special instructions?"
                  className="w-full"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  Place Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

MainCard.propTypes = {
  handleLikeBtnClick: PropTypes.func,
  isLiked: PropTypes.any,
  wishList: PropTypes.array,
  products: PropTypes.array,
};

export default MainCard;