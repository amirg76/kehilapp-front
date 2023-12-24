import React from "react";
//routing
import { Routes, Route } from "react-router-dom";
import routeConfig from "@routes/routeConfig";
// import Navbar from "./components/navbar/Navbar";
import Header from './components/header/Header';
//components
//TODO: import NAVBAR

const App = () => {
  return (
    <div className="w-screen flex flex-col">
      {/* <Navbar /> */}
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
