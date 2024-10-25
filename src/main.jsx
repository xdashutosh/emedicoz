import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/main.css";
import "./index.css";
import Router from "./Router.jsx";
import { Provider } from "react-redux";
import store, { persistor } from "./network/store.js";
import "./assets/css/cbt_success/style.css";
import "./components/Navbar/nav.css";
import "./assets/css/home-page/style.css";
import "./assets/css/home-page/responsive.css";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router />
    </PersistGate>
  </Provider>
);
