import React, { useContext, useEffect, useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import useDocTitle from "../hooks/useDocTitle";
import FilterBar from "../components/filters/FilterBar";
import ProductCard from "../components/product/ProductCard";
import Services from "../components/common/Services";
import filtersContext from "../contexts/filters/filtersContext";
import EmptyView from "../components/common/EmptyView";

const AllProducts = () => {
  useDocTitle("All Products");

  const { allProducts } = useContext(filtersContext);
  console.log("allProducts: ", allProducts);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(allProducts);
  }, [allProducts]);

  return (
    <>
      <section id="all_products" className="section">
        <FilterBar />

        <div className="container">
          {data && data.length !== 0 ? (
            <div className="wrapper products_wrapper">
              {data?.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <EmptyView icon={<BsExclamationCircle />} msg="No Results Found" />
          )}
        </div>
      </section>

      <Services />
    </>
  );
};

export default AllProducts;
