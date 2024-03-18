import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import { Route } from "react-router-dom";
import Customer from "./components/Customer";
import Transactions from "./components/Transaction";
import NewAccount from "./components/NewAccount";

const App = () => {
  return (
    <>
      <Navbar />
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/customer">
        <Customer />
      </Route>
      <Route path="/transaction">
        <Transactions />
      </Route>
      <Route path="/add">
        <NewAccount />
      </Route>
    </>
  );
};

export default App;
