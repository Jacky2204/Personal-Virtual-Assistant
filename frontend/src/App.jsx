import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import Customize from "./Pages/Customize";
import Home from "./Pages/Home";
import { UserDataContext } from "./Context/UserContext";
import Customize2 from "./Pages/Customize2";

function App() {
  const { userData, setUserData, isLoading } = useContext(UserDataContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoading ? (
            <div>Loading...</div>
          ) : userData?.assistantName && userData?.assistantImage ? (
            <Home />
          ) : (
            <Navigate to={"/customize"} />
          )
        }
      />

      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to={"/signup"} />}
      />
      {/* <Route path="/customize" element={<Customize />} /> */}

      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to={"/signup"} />}
      />
      {/* <Route path="/customize2" element={<Customize2 />} /> */}
    </Routes>
  );
}

export default App;
