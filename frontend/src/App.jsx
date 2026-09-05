import React, { useState } from "react";
import Signup from "./Pages/Auth/signup";
import Login from "./Pages/Auth/login";

const App = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      <button onClick={() => setShowLogin((prev) => !prev)}>
        Switch to {showLogin ? "Signup" : "Login"}
      </button>
      {showLogin ? <Login /> : <Signup />}
    </div>
  );
};

export default App;
