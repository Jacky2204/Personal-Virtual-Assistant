import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "https://personal-virtual-assistant-backend.onrender.com";

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUserData = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/currentUser`, {
        withCredentials: true,
      });
      setUserData(result.data.user);
      setIsLoading(false);
      // console.log(result.data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        {
          withCredentials: true,
        }
      );
      // console.log("result",result.data)
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    serverUrl,
    userData,
    setUserData,
    isLoading,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  useEffect(() => {
    handleCurrentUserData();
  }, []);

  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}

export default UserContext;
