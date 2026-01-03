import React, { useContext } from "react";
import { userDataContext } from "../Context/UserContext.jsx";

function Card({ image }) {
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
  } = useContext(userDataContext);

  return (
    <div className={`w-[80px] h-[150px] lg:w-[165px] lg:h-[250px] bg-[#020231] border-2 border-[#0000ff69] rounded-2xl overflow-hidden hover:border-4 hover:border-[white] hover:shadow-blue-950 cursor-pointer ${selectedImage==image?"border-4 border-[white] shadow-blue-950":null}`}>
      <img
        src={image}
        alt=""
        className="h-full object-cover"
        onClick={() => {
          setSelectedImage(image);
          setBackendImage(null)
          setFrontendImage(null)
        }}
      />
    </div>
  );
}

export default Card;
