import React from "react";
//routing
import { Routes, Route } from "react-router-dom";
// import routeConfig from "@routes/routeConfig";
//components
//TODO: import NAVBAR

const App = () => {
  return (
    <>
      {/* //TODO: replcae div component with Navbar*/}
      <div className="h-[64px] bg-gray-500">NAVBAR COMPONENT</div>
      {/* //TODO: when is logged in redirect to the corresponding page, else redirect to login page */}
      {/* <Routes>
        {routeConfig.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
            exact={route.exact}
          />
        ))}
      </Routes> */}
    </>
  );
};

export default App;
