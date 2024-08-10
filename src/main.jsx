import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/index.js";
import "./index.css";
//This line is importing the `QueryClient` and `QueryClientProvider` components from the `react-query` library. These components are used for managing data fetching and caching in a React application. The `QueryClient` is responsible for creating a client object that can be used to make queries to the server, and the `QueryClientProvider` component is used to wrap the root component of the application so that the `QueryClient` is available to all components in the application.
import { QueryClient, QueryClientProvider } from "react-query";

// react router Browser Router
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
