import React from "react";
import reviewsData from "../../data/reviewsData";
import useActive from "../../hooks/useActive";
import ProductReviews from "./ProductReviews";

const ProductSummaryCombo = (props) => {
  const {
    id,
    name,
    priceReduction,
    description,
  } = props;

  const { active, handleActive, activeClass } = useActive("specs");

  return (
    <>
      <section id="product_summary" className="section">
        <div className="container">
          {/*===== Product-Summary-Tabs =====*/}
          <div className="prod_summary_tabs">
            <ul className="tabs">
              <li
                className={`tabs_item ${activeClass("specs")}`}
                onClick={() => handleActive("specs")}
              >
                Specifications
              </li>
              <li
                className={`tabs_item ${activeClass("overview")}`}
                onClick={() => handleActive("overview")}
              >
                Overview
              </li>
              <li
                className={`tabs_item ${activeClass("reviews")}`}
                onClick={() => handleActive("reviews")}
              >
                Reviews
              </li>
            </ul>
          </div>

          {/*===== Product-Summary-Details =====*/}
          <div className="prod_summary_details">
            {active === "specs" ? (
              <div className="prod_specs">
                <ul>
                  <li>
                    <span>Name</span>
                    <span>{name}</span>
                  </li>
                  <li>
                    <span>Price Reduction</span>
                    <span>{priceReduction}</span>
                  </li>
                </ul>
              </div>
            ) : active === "overview" ? (
              <div className="prod_overview">
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
            ) : (
              <div className="prod_reviews">
                <ul>
                  {reviewsData.map((item) => (
                    <ProductReviews key={item.id} {...item} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductSummaryCombo;
