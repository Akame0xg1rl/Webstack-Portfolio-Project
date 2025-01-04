import PropTypes from "prop-types";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";
import { instance } from "../utils/useRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

function SignUp() {
  const [postUser, setPostUser] = useState({
    newUserName: "",
    newUserEmail: "",
    newUserPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = (e) => {
    const { value, name } = e.target;
    setPostUser((prev) => ({ ...prev, [name]: value }));
  };

  const SignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!postUser.newUserName || !postUser.newUserEmail || !postUser.newUserPassword) {
        throw new Error("All fields are required");
      }

      const response = await instance.post("/signup", postUser);

      if (response.data?.status === "ok") {
        toast({
          title: "Welcome aboard!",
          description: "Your digital planning journey begins now.",
          className: "bg-green-100 border-green-500 text-green-800",
        });
        navigate("/login");
      } else {
        throw new Error(response.data?.message || "Signup failed");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong.",
        description: err.response?.data?.message || err.message || "Please try again or contact support.",
      });
      setPostUser((prev) => ({ ...prev, newUserPassword: "" }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-[#FFF5F7] text-black">
      <form
        onSubmit={SignUp}
        className="flex gap-8 flex-col w-1/2 max-w-md mx-auto bg-[#FFF5F7] p-10 rounded-3xl shadow-lg"
      >
        <div className="text-center">
          <FontAwesomeIcon icon={faUser} className="text-4xl text-[#FF69B4] mb-4" />
          <h1 className="text-3xl font-bold text-[#000000]">Start Planning Today</h1>
          <p className="text-gray-700 mt-2">Sign up for your digital planner</p>
        </div>
        <div className="relative">
          <FontAwesomeIcon icon={faUser} className="absolute top-3 left-3 text-gray-400" />
          <Input
            name="newUserName"
            placeholder="Username"
            type="text"
            value={postUser.newUserName}
            onChange={handleSignUp}
            className="pl-10 border-gray-600 bg-white text-black focus:border-pink-500 focus:ring focus:ring-pink-300 transition duration-200"
          />
        </div>
        <div className="relative">
          <FontAwesomeIcon icon={faEnvelope} className="absolute top-3 left-3 text-gray-400" />
          <Input
            name="newUserEmail"
            placeholder="Email"
            type="email"
            value={postUser.newUserEmail}
            onChange={handleSignUp}
            className="pl-10 border-gray-600 bg-white text-black focus:border-pink-500 focus:ring focus:ring-pink-300 transition duration-200"
          />
        </div>
        <div className="relative">
          <FontAwesomeIcon icon={faLock} className="absolute top-3 left-3 text-gray-400" />
          <Input
            name="newUserPassword"
            placeholder="Password"
            type="password"
            value={postUser.newUserPassword}
            onChange={handleSignUp}
            className="pl-10 border-gray-600 bg-white text-black focus:border-pink-500 focus:ring focus:ring-pink-300 transition duration-200"
          />
        </div>
        <Button 
          className="bg-gradient-to-r from-[#FF69B4] to-[#FF85C1] hover:from-[#FF7AC3] hover:to-[#FF90D3] text-white font-bold py-2 px-6 rounded-full w-full transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
        <p className="text-center text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-[#FF69B4] hover:text-[#ff85c1] transition duration-200">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;

SignUp.propTypes = {
  setIsLogged: PropTypes.func,
};
