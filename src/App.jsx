import React from "react";
//routing
import { Routes, Route } from "react-router-dom";
import routeConfig from "@routes/routeConfig";
import Header from "@components/Header/Header";

const App = () => {
  return (
    <div className="w-screen flex flex-col ">
      <Header />
      {/* //TODO: when is logged in redirect to the corresponding page, else redirect to login page */}

      <Routes>
        {routeConfig.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
            exact={route.exact}
          />
        ))}
      </Routes>
    </div>
  );
};

export default App;
