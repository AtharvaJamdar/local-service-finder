import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Signup from "./Pages/Auth/signup";
import Login from "./Pages/Auth/login";
// import Services from "./Pages/Services";
import Map from "./Pages/Map";

const App = () => {
  // const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      {/* <div className="container" style={{ paddingTop: "24px" }}>
        <button onClick={() => setShowLogin((prev) => !prev)}>
          Switch to {showLogin ? "Signup" : "Login"}
        </button>
        {showLogin ? <Login /> : <Signup />}
      </div> */}
      {/* <Services />; */}
      <Map />
    </div>
  );
};

export default App;
