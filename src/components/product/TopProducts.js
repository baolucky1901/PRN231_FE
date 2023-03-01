import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import useActive from "../../hooks/useActive";
import ProductCard from "./ProductCard";

const TopProducts = () => {
  const [data, setData] = useState([]);

  const [products, setProducts] = useState(data);
  const { activeClass, handleActive } = useActive(0);

  // making a unique set of product's category
  const productsCategory = [
    "All",
    ...new Set(data.map((item) => item.categoryName)),
  ];

  // handling product's filtering

  const handleProducts = (category, i) => {
    if (category === "All") {
      setProducts(data);
      handleActive(i);
      return;
    }

    const filteredProducts = data.filter(
      (item) => item.categoryName === category
    );
    setProducts(filteredProducts);
    handleActive(i);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://localhost:44301/api/books/cus/top-books?page=1&pageSize=11"
      );
      const jsonData = await response.json();
      setData(jsonData.data);
      setProducts(jsonData.data);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="products_filter_tabs">
        <ul className="tabs">
          {productsCategory?.map((item, i) => (
            <li
              key={i}
              className={`tabs_item ${activeClass(i)}`}
              onClick={() => handleProducts(item, i)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="wrapper products_wrapper">
        {products?.slice(0, 11).map((item) => (
          <ProductCard key={item.id} {...item} />
        ))}
        <div className="card products_card browse_card">
          <Link to="/all-products">
            Browse All <br /> Products <BsArrowRight />
          </Link>
        </div>
      </div>
    </>
  );
};

export default TopProducts;
