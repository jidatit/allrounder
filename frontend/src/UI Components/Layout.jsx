import React from "react";
import Menu from "./Header";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <header>
        <Header />
        <Outlet />
        <Footer />
      </header>
    </>
  );
}

export default Layout;
