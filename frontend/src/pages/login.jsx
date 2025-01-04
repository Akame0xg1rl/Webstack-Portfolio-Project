import PropTypes from "prop-types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";
import { instance } from "../utils/useRequest";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

function Login({ setIsLogged }) {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async () => {
    setIsLoading(true);
    try {
      const data = await instance.post("/login", formData);
      if (data?.data?.user) {
        localStorage.setItem("access_token", data.data?.user);
        setIsLogged(true);
        navigate("/");
        return;
      }
      throw Error();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Oops! Login failed.",
        description: "Please check your email and password.",
      });
      setFormData({
        userEmail: "",
        userPassword: "",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-[#FFF5F7] text-black h-screen flex items-center justify-center">
      <div className="bg-[#FFF] p-8 rounded-3xl shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-[#FF69B4] mb-4">Welcome Back!</h1>
          <p className="text-lg text-gray-700">Sign in to access your digital planner</p>
        </div>
        <div className="relative mb-6">
          <Input
            name="userEmail"
            placeholder="Email"
            type="email"
            value={formData.userEmail}
            onChange={handleChange}
            className="pl-10 border-gray-600 bg-[#F7F7F7] text-black focus:border-[#FF69B4] focus:ring-[#FF69B4] rounded-lg transition duration-200"
          />
          <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative mb-6">
          <Input
            name="userPassword"
            placeholder="Password"
            type="password"
            value={formData.userPassword}
            onChange={handleChange}
            className="pl-10 border-gray-600 bg-[#F7F7F7] text-black focus:border-[#FF69B4] focus:ring-[#FF69B4] rounded-lg transition duration-200"
          />
          <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Button
          onClick={onLogin}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#FF69B4] to-[#FF85C1] hover:from-[#FF7AC3] hover:to-[#FF90D3] text-white font-bold py-2 px-6 rounded-full w-full transition duration-300"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
        <div className="text-center mt-6">
          <span className="text-gray-700">Don't have an account? </span>
          <Link to="/signUp" className="text-[#FF69B4] hover:text-[#FF85C1] font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

Login.propTypes = {
  setIsLogged: PropTypes.func,
};
