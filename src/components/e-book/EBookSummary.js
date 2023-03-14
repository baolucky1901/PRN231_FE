import React from "react";
import reviewsData from "../../data/reviewsData";
import useActive from "../../hooks/useActive";
import ProductReviews from "../product/ProductReviews";

const EBookSummary = (props) => {
  const {
    id,
    name,
    isbn,
    author,
    releaseYear,
    version,
    description,
    categoryName,
    publisherName,
    hasEbook,
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
                    <span>ISBN</span>
                    <span>{isbn}</span>
                  </li>
                  <li>
                    <span>Author</span>
                    <span>{author}</span>
                  </li>
                  <li>
                    <span>Release Year</span>
                    <span>{releaseYear}</span>
                  </li>
                  <li>
                    <span>Version</span>
                    <span>{version}</span>
                  </li>
                  <li>
                    <span>Category Name</span>
                    <span>{categoryName}</span>
                  </li>
                  <li>
                    <span>Publisher Name</span>
                    <span>{publisherName}</span>
                  </li>
                  <li>
                    <span>Has E-Book</span>
                    <span>{hasEbook === "true" ? "Yes" : "No"}</span>
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

export default EBookSummary;
