import React, { useContext } from "react";
import { IoMdStar } from "react-icons/io";
import { Link } from "react-router-dom";
import { displayMoney } from "../../helpers/utils";
import cartContext from "../../contexts/cart/cartContext";
import useActive from "../../hooks/useActive";

const ProductCard = (props) => {
  const { id, name, imgPath, price } = props;

  const { addItem } = useContext(cartContext);
  const { active, handleActive, activeClass } = useActive(false);

  // const formattedPrice = price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});

  // handling Add-to-cart
  const handleAddItem = () => {
    const item = { ...props };
    addItem(item);

    handleActive(id);

    setTimeout(() => {
      handleActive(false);
    }, 3000);
  };

  // const newPrice = displayMoney(finalPrice);
  // const oldPrice = displayMoney(originalPrice);

  return (
    <>
      <div className="card products_card">
        <figure className="products_img">
          <Link to={`/product-details/${id}`}>
            <img src={imgPath} alt="product-img" />
          </Link>
        </figure>
        <div className="products_details">
          {/* <span className="rating_star">
                        {
                            [...Array(rateCount)].map((_, i) => <IoMdStar key={i} />)
                        }
                    </span> */}
          <div className="products_details_title">
            <h3 className="products_title">
              <Link to={`/product-details/${id}`}>{name}</Link>
            </h3>
          </div>
          {/* <div className="products_details_info">
                        <h5 className="products_info">{info}</h5>
                    </div> */}
          <div className="separator"></div>
          <h2 className="products_price">
            {/* {formattedPrice} */}
            {price}
          </h2>
          {/* <button
                        type="button"
                        className={`btn products_btn ${activeClass(id)}`}
                        onClick={handleAddItem}
                    >
                        {active ? 'Added' : 'Add to cart'}
                    </button> */}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
