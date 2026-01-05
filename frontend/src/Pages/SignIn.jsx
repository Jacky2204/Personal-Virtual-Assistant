import React, { useContext, useState } from "react";
import bg from "../assets/bg.mp4";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../Context/UserContext.jsx";
import axios from "axios";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [email, setEmaill] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const { serverUrl, userData, setUserData } = useContext(UserDataContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      console.log(result);
      setUserData(result.data.user);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      setUserData(null);
      setErr(error.response.data.message);
    }
  };

  return (
    <div className="relative w-full h-[100vh] flex justify-center items-center overflow-hidden">
      <video
        src={bg}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <form
        action=""
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col justify-center items-center gap-[20px] px-[20px]"
        onSubmit={handleSignIn}
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px]">
          Sign In to <span className="text-blue-500">Virtual Assistant</span>
        </h1>

        <input
          type="emil"
          placeholder="Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          onChange={(e) => {
            setEmaill(e.target.value);
          }}
          value={email}
        />

        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full outline-none rounded-full bg-transparent placeholder-gray-300 px-[20px] py-[10px]"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />

          {!showPassword && (
            <IoEye
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => {
                setShowPassword(true);
              }}
            />
          )}

          {showPassword && (
            <IoEyeOff
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => {
                setShowPassword(false);
              }}
            />
          )}
        </div>

        {err.length > 0 && <p className="text-red-500 text-[17px]">*{err}*</p>}

        <button
          className="min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold mt-[30px]"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p
          className="text-white text-[18px] cursor-pointer"
          onClick={() => {
            navigate("/signup");
          }}
        >
          Want to create an account?{" "}
          <span className="text-blue-400">Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
