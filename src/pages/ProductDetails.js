import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdStar, IoMdCheckmark } from "react-icons/io";
import useDocTitle from "../hooks/useDocTitle";
import useActive from "../hooks/useActive";
import cartContext from "../contexts/cart/cartContext";
import productsData from "../data/productsData";
import SectionsHead from "../components/common/SectionsHead";
import RelatedSlider from "../components/sliders/RelatedSlider";
import ProductSummary from "../components/product/ProductSummary";
import Services from "../components/common/Services";
import { UseAuth } from "../contexts/auth/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import commonContext from "../contexts/common/commonContext";

const ProductDetails = () => {
  useDocTitle("Product Details");

  const { user } = UseAuth();
  // console.log("User Header: ", user);

  const { toggleForm } = useContext(commonContext);

  const { handleActive, activeClass } = useActive(0);

  const { addItem } = useContext(cartContext);

  const { productId } = useParams();

  // here the 'id' received has 'string-type', so converting it to a 'Number'
  const prodId = parseInt(productId);

  // showing the Product based on the received 'id'
  const product = productsData.find((item) => item.id === prodId);

  const { category, ratings, rateCount } = product;

  const [data, setData] = useState({});
  const [image, setImage] = useState([]);
  const [ebookData, setEbookData] = useState({});

  const { id, name, price, description, amount, categoryName, hasEbook } = data;

  const subDescription = description?.substring(0, 258);

  const [previewImg, setPreviewImg] = useState(image[0]);

  const [selectedValue, setSelectedValue] = useState("");

  const handleOption = (event) => {
    setSelectedValue(event.target.value);
  };

  // api select button book
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://localhost:44301/api/books/book/${prodId}`
      );
      const data = await res.json();
      setData(data.data);

      const resImage = await fetch(
        `https://localhost:44301/api/book-images/book-image/book/${prodId}`
      );
      const dataResImage = await resImage.json();
      setImage(dataResImage.data);
      setPreviewImg(dataResImage.data[0].imgPath);

      const resDataEbook = await fetch(
        `https://localhost:44301/api/ebooks/ebook/book/${prodId}`
      );
      const dataResDataEbook = await resDataEbook.json();
      setEbookData(dataResDataEbook.data);
    };

    fetchData();
  }, []);

  // console.log("Ebook Data: ", ebookData);

  // handling Add-to-cart
  const handleAddItem = () => {
    if (Object.keys(user).length === 0) {
      toggleForm(true);
    } else if (selectedValue === "") {
      toast.warning("You must choose type of book!");
      // alert("You must choose type of book!");
    } else {
      addItem({
        ...data,
        cateItem: selectedValue,
        previewImg: previewImg,
        quantity: 1,
        price: selectedValue === "E-Book" ? ebookData.price : data.price,
        id: selectedValue === "E-Book" ? ebookData.ebookId : data.id,
      });
    }
  };

  // setting the very-first image on re-render
  useEffect(() => {
    if (image.length !== 0) {
      setPreviewImg(image[0].imgPath);
      handleActive(0);
    }
  }, []);

  // handling Preview image
  const handlePreviewImg = (i) => {
    setPreviewImg(image[i].imgPath);
    handleActive(i);
  };

  return (
    <>
      <section id="product_details" className="section">
        <div className="container">
          <div className="wrapper prod_details_wrapper">
            {/*=== Product Details Left-content ===*/}
            <div className="prod_details_left_col">
              <div className="prod_details_tabs">
                {image?.map((img, i) => (
                  <div
                    key={i}
                    className={`tabs_item ${activeClass(i)}`}
                    onClick={() => handlePreviewImg(i)}
                  >
                    <img src={img.imgPath} alt="product-img" />
                  </div>
                ))}
              </div>
              <figure className="prod_details_img">
                <img src={previewImg} alt="product-img" />
              </figure>
            </div>

            {/*=== Product Details Right-content ===*/}
            <div className="prod_details_right_col">
              <h1 className="prod_details_title">{name}</h1>
              <h4 className="prod_details_info">{categoryName}</h4>

              <h5 className="prod_details_desc">{subDescription}...</h5>

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
                  <h2 className="price">{price} &nbsp;</h2>
                </div>

                <div className="badge">
                  <span>
                    <IoMdCheckmark /> In Stock
                  </span>
                </div>
              </div>

              <div className="separator"></div>

              <div className="prod_details_offers">
                <h4>Choose Type:</h4>
                <div className="prod_details_types">
                  {hasEbook === true && amount > 0 ? (
                    <>
                      <div className="prod_details_element physical-book">
                        <input
                          type="radio"
                          id="swatch-0-physical-book"
                          value="Physical Book"
                          checked={selectedValue === "Physical Book"}
                          onChange={handleOption}
                        />
                        <label htmlFor="swatch-0-physical-book" className="sd">
                          <span>Physical Book</span>
                        </label>
                      </div>
                      <div className="prod_details_element e-book">
                        <input
                          type="radio"
                          id="swatch-0-ebook"
                          value="E-Book"
                          checked={selectedValue === "E-Book"}
                          onChange={handleOption}
                        />
                        <label htmlFor="swatch-0-ebook" className="sd">
                          <span>E-Book</span>
                        </label>
                      </div>
                    </>
                  ) : hasEbook === false && amount > 0 ? (
                    <div className="prod_details_element physical-book">
                      <input
                        type="radio"
                        id="swatch-0-physical-book"
                        value="Physical Book"
                        checked={selectedValue === "Physical Book"}
                        onChange={handleOption}
                      />
                      <label htmlFor="swatch-0-physical-book" className="sd">
                        <span>Physical Book</span>
                      </label>
                    </div>
                  ) : amount === null ? (
                    <>
                      <div className="prod_details_element e-book">
                        <input
                          type="radio"
                          id="swatch-0-ebook"
                          value="E-Book"
                          checked={selectedValue === "E-Book"}
                          onChange={handleOption}
                        />
                        <label htmlFor="swatch-0-ebook" className="sd">
                          <span>E-Book</span>
                        </label>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
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

      <ProductSummary {...data} />

      <section id="related_products" className="section">
        <div className="container">
          <SectionsHead heading="Related Products" />
          <RelatedSlider category={category} />
        </div>
      </section>

      <Services />
      <ToastContainer />
    </>
  );
};

export default ProductDetails;
