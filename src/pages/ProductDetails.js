import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdStar, IoMdCheckmark } from "react-icons/io";
import { calculateDiscount, displayMoney } from "../helpers/utils";
import useDocTitle from "../hooks/useDocTitle";
import useActive from "../hooks/useActive";
import cartContext from "../contexts/cart/cartContext";
import productsData from "../data/productsData";
import SectionsHead from "../components/common/SectionsHead";
import RelatedSlider from "../components/sliders/RelatedSlider";
import ProductSummary from "../components/product/ProductSummary";
import Services from "../components/common/Services";
import { axiosClient } from "../helpers/axios";

const ProductDetails = () => {
  useDocTitle("Product Details");

  const { handleActive, activeClass } = useActive(0);

  const { addItem } = useContext(cartContext);

  const { productId } = useParams();

  // here the 'id' received has 'string-type', so converting it to a 'Number'
  const prodId = parseInt(productId);

  // showing the Product based on the received 'id'
  const product = productsData.find((item) => item.id === prodId);

  const {
    images,
    title,
    info,
    category,
    finalPrice,
    originalPrice,
    ratings,
    rateCount,
  } = product;

  const [data, setData] = useState({});
  const [image, setImage] = useState({});

  const {
    id,
    name,
    isbn,
    author,
    releaseYear,
    version,
    price,
    description,
    amount,
    categoryName,
    publisherName,
  } = data;

  const [previewImg, setPreviewImg] = useState(images[0]);

  // Select button Book (loai sach)

  const [selectedValue, setSelectedValue] = useState("");

  // handling Select-button-Book (loai sach)
  const handleOption = (event) => {
    setSelectedValue(event.target.value);
  };

  // api select button book
  useEffect(() => {
    axiosClient.get(`/books/book/${prodId}`).then((response) => {
      setData(response.data.data);
    });

    axiosClient.get(`/book-images/book-image/book/${prodId}`).then((res) => {
      setImage(res.data.data);
    });
  }, []);
  console.log("data: ", data);
  console.log("Image: ", image);

  // handling Add-to-cart
  const handleAddItem = () => {
    addItem(product);
  };

  // setting the very-first image on re-render
  useEffect(() => {
    setPreviewImg(images[0]);
    handleActive(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // handling Preview image
  const handlePreviewImg = (i) => {
    setPreviewImg(images[i]);
    handleActive(i);
  };

  // calculating Prices
  const discountedPrice = originalPrice - finalPrice;
  const newPrice = displayMoney(finalPrice);
  const oldPrice = displayMoney(originalPrice);
  const savedPrice = displayMoney(discountedPrice);
  const savedDiscount = calculateDiscount(discountedPrice, originalPrice);

  return (
    <>
      <section id="product_details" className="section">
        <div className="container">
          <div className="wrapper prod_details_wrapper">
            {/*=== Product Details Left-content ===*/}
            <div className="prod_details_left_col">
              <div className="prod_details_tabs">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`tabs_item ${activeClass(i)}`}
                    onClick={() => handlePreviewImg(i)}
                  >
                    <img src={img} alt="product-img" />
                  </div>
                ))}
              </div>
              <figure className="prod_details_img">
                <img src={previewImg} alt="product-img" />
              </figure>
            </div>

            {/*=== Product Details Right-content ===*/}
            <div className="prod_details_right_col">
              <h1 className="prod_details_title">{title}</h1>
              <h4 className="prod_details_info">{info}</h4>
              <h5 className="prod_details_desc">{description}</h5>

              <div className="prod_details_ratings">
                <span className="rating_star">
                  {[...Array(rateCount)].map((_, i) => (
                    <IoMdStar key={i} />
                  ))}
                </span>
                <span>|</span>
                <Link to="*">{ratings} Ratings</Link>
              </div>

              <div className="separator"></div>

              <div className="prod_details_price">
                <div className="price_box">
                  <h2 className="price">
                    {newPrice} &nbsp;
                    <small className="del_price">
                      <del>{oldPrice}</del>
                    </small>
                  </h2>
                  <p className="saved_price">
                    You save: {savedPrice} ({savedDiscount}%)
                  </p>
                  <span className="tax_txt">(Inclusive of all taxes)</span>
                </div>

                <div className="badge">
                  <span>
                    <IoMdCheckmark /> In Stock
                  </span>
                </div>
              </div>

              <div className="separator"></div>

              <div className="prod_details_offers">
                <h4>Type:</h4>
                {/* <ul>
                                    <li>No Cost EMI on Credit Card</li>
                                    <li>Pay Later & Avail Cashback</li>
                                </ul> */}
                <div className="prod_details_types">
                  <div className="prod_details_element physical-book">
                    <input
                      type="radio"
                      id="swatch-0-physical-book"
                      value="option2"
                      checked={selectedValue === "option2"}
                      onChange={handleOption}
                    />
                    <label for="swatch-0-physical-book" className="sd">
                      <span>Physical Book</span>
                    </label>
                  </div>
                  <div className="prod_details_element e-book">
                    <input
                      type="radio"
                      id="swatch-0-ebook"
                      value="option1"
                      checked={selectedValue === "option1"}
                      onChange={handleOption}
                    />
                    <label for="swatch-0-ebook" className="sd">
                      <span>E-Book</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="separator"></div>

              <div className="prod_details_buy_btn">
                <button type="button" className="btn" onClick={handleAddItem}>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductSummary {...product} />

      <section id="related_products" className="section">
        <div className="container">
          <SectionsHead heading="Related Products" />
          <RelatedSlider category={category} />
        </div>
      </section>

      <Services />
    </>
  );
};

export default ProductDetails;
