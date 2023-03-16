import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cartContext from "../../contexts/cart/cartContext";
import useActive from "../../hooks/useActive";

const ProductCard = (props) => {
  const { id, name, imgPath, price, amount } = props;

  const { addItem } = useContext(cartContext);
  const { active, handleActive, activeClass } = useActive(false);

  const [previewImg, setPreviewImg] = useState();

  useEffect(() => {
    setPreviewImg(imgPath);
  }, []);

  // handling Add-to-cart
  const handleAddItem = () => {
    const item = {
      ...props,
      previewImg: previewImg,
      quantity: 1,
      bookId: id,
      bookAmount: amount,
    };
    addItem(item);

    handleActive(id);

    setTimeout(() => {
      handleActive(false);
    }, 3000);
  };

  return (
    <>
      <div className="card products_card">
        <figure className="products_img">
          <Link to={`/product-details/${id}`}>
            <img src={imgPath} alt="product-img" />
          </Link>
        </figure>
        <div className="products_details">
          <div className="products_details_title">
            <h3 className="products_title">
              <Link to={`/product-details/${id}`}>{name}</Link>
            </h3>
          </div>
          <div className="separator"></div>
          <h2 className="products_price">{price} VNĐ</h2>
          <button
            type="button"
            className={`btn products_btn ${activeClass(id)}`}
            onClick={handleAddItem}
          >
            {active ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
