import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdCheckmark } from "react-icons/io";
import useDocTitle from "../hooks/useDocTitle";
// import useActive from "../hooks/useActive";
import cartContext from "../contexts/cart/cartContext";
// import RelatedSlider from "../components/sliders/RelatedSlider";
import EBookSummary from "../components/e-book/EBookSummary";
import Services from "../components/common/Services";
import { UseAuth } from "../contexts/auth/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import commonContext from "../contexts/common/commonContext";
import { ToastContainer } from "react-toastify";

const EBookDetails = () => {
  useDocTitle("E-Book Details");

  const { user } = UseAuth();

  const { toggleForm } = useContext(commonContext);

  const { addItem } = useContext(cartContext);

  const { ebookId } = useParams();

  // here the 'id' received has 'string-type', so converting it to a 'Number'
  const prodId = parseInt(ebookId);

  // showing the Product based on the received 'id'
  // const product = productsData.find((item) => item.id === prodId);

  const [data, setData] = useState({});

  const { name, price, description, imgPath } = data;

  const subDescription = description?.substring(0, 258);

  // api select button book
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://localhost:44301/api/ebooks/ebook/${prodId}`
      );
      const data = await res.json();
      setData(data.data);
    };
    fetchData();
  }, []);

  // handling Add-to-cart
  const handleAddItem = () => {
    if (Object.keys(user).length === 0) {
      toggleForm(true);
    } else {
      addItem({
        ...data,
        previewImg: imgPath,
        quantity: 1,
        price: data.price,
        ebookId: data.ebookId,
      });
    }
  };

  return (
    <>
      <section id="product_details" className="section">
        <div className="container">
          <div className="wrapper prod_details_wrapper">
            {/*=== Product Details Left-content ===*/}
            <div className="prod_details_left_col">
              <div className="prod_details_tabs"></div>
              <figure className="prod_details_img">
                <img src={imgPath} alt="product-img" />
              </figure>
            </div>

            {/*=== Product Details Right-content ===*/}
            <div className="prod_details_right_col">
              <h1 className="prod_details_title">{name}</h1>
              {/* <h4 className="prod_details_info">{categoryName}</h4> */}

              <h5 className="prod_details_desc">{subDescription}...</h5>

              <div className="separator"></div>

              <div className="prod_details_price">
                <div className="price_box">
                  <h2 className="price">{price} VNĐ &nbsp;</h2>
                </div>

                <div className="badge">
                  <span>
                    <IoMdCheckmark /> In Stock
                  </span>
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

      <EBookSummary {...data} />

      <Services />
      <ToastContainer />
    </>
  );
};

export default EBookDetails;
