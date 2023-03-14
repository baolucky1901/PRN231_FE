import React from "react";
import { Routes, Route } from "react-router";
import useScrollRestore from "../hooks/useScrollRestore";
import AllProducts from "../pages/AllProducts";
import Cart from "../pages/Cart";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import ProductCombo from "../pages/ProductCombo";
import ErrorPage from "../pages/ErrorPage";
import Order from "../pages/Order";
import EBookDetails from "../pages/EBookDetails";
import AllEBook from "../pages/AllEBook";

const RouterRoutes = () => {
  useScrollRestore();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route
          path="/product-details/:productId"
          element={<ProductDetails />}
        />
        <Route path="all-ebooks" element={<AllEBook />} />
        <Route path="/e-book-details/:ebookId" element={<EBookDetails />} />
        <Route
          path="/product-combo-details/:productId"
          element={<ProductCombo />}
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default RouterRoutes;
