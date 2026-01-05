import React, { useContext, useRef } from "react";
import Card from "../components/Card";
// import bg from "../assets/bg.avif"
import image1 from "./../assets/‫image1.jpg";
import image2 from "./../assets/image2.jpg";
import image3 from "./../assets/image3.jpg";
import image4 from "./../assets/image4.jpg";
import image5 from "./../assets/image5.jpg";
import image6 from "./../assets/image6.jpg";
import image7 from "./../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { UserDataContext } from "../Context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
  const {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserDataContext);

  const inputImage = useRef();
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#040443] flex justify-center items-center flex-col">
      {userData?.assistantImage && <MdKeyboardBackspace
        className="text-white h-[25px] w-[25px] absolute top-[30px] left-[30px] font-extrabold cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      />}

      <h1 className="text-white text-[30px] text-center p-10 font-semibold">
        Select Your <span className="text-blue-300">Assistant Image</span>
      </h1>

      <div className="w-[90%] max-w-[65%] flex justify-center items-center flex-wrap lg:gap-[25px] gap-[10px]">
        {/* <Card image={bg} /> */}
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

        <div
          className={`w-[80px] h-[150px] lg:w-[165px] lg:h-[250px] bg-[#020231] border-2 border-[#0000ff69] rounded-2xl overflow-hidden hover:border-4 hover:border-[white] hover:shadow-blue-950 cursor-pointer flex items-center justify-center ${
            selectedImage == "input"
              ? "border-4 border-[white] shadow-blue-950"
              : null
          } `}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && (
            <RiImageAddLine className="text-white w-[25px] h-[25px]" />
          )}

          {frontendImage && (
            <img src={frontendImage} alt="" className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {selectedImage ? (
        <button
          className="min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold mt-[30px] cursor-pointer"
          onClick={() => {
            navigate("/customize2");
          }}
        >
          Next
        </button>
      ) : null}
    </div>
  );
}

export default Customize;
