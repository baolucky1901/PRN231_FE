import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdCheckmark } from "react-icons/io";
import useDocTitle from "../hooks/useDocTitle";
import useActive from "../hooks/useActive";
import cartContext from "../contexts/cart/cartContext";
// import RelatedSlider from "../components/sliders/RelatedSlider";
import ProductSummary from "../components/product/ProductSummary";
import Services from "../components/common/Services";
import { UseAuth } from "../contexts/auth/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import commonContext from "../contexts/common/commonContext";

const ProductDetails = () => {
  useDocTitle("Book Details");

  const { user } = UseAuth();

  const { toggleForm } = useContext(commonContext);

  const { handleActive, activeClass } = useActive(0);

  const { addItem } = useContext(cartContext);

  const { productId } = useParams();

  // here the 'id' received has 'string-type', so converting it to a 'Number'
  const prodId = parseInt(productId);

  // showing the Product based on the received 'id'
  // const product = productsData.find((item) => item.id === prodId);

  const [data, setData] = useState({});
  const [image, setImage] = useState([]);

  const { name, price, description, categoryName } = data;

  const subDescription = description?.substring(0, 258);

  const [previewImg, setPreviewImg] = useState(image[0]);

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
    };

    fetchData();
  }, []);
  // console.log("Ebook Data: ", ebookData);

  // handling Add-to-cart
  const handleAddItem = () => {
    if (Object.keys(user).length === 0) {
      toggleForm(true);
    } else {
      addItem({
        ...data,
        previewImg: previewImg,
        quantity: 1,
        price: data.price,
        bookId: data.id,
        bookAmount: data.amount,
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

      <ProductSummary {...data} />

      <Services />
    </>
  );
};

export default ProductDetails;
