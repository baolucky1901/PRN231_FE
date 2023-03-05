import React, { useContext } from "react";
import { TbTrash } from "react-icons/tb";
import { Link } from "react-router-dom";
import { displayMoney } from "../../helpers/utils";
import cartContext from "../../contexts/cart/cartContext";
import QuantityBox from "../common/QuantityBox";
import { IoIosBook, IoMdBook } from "react-icons/io";

const CartItem = (props) => {
  const {
    id,
    previewImg,
    finalPrice,
    originalPrice,
    quantity,
    path,
    cateItem,
    price,
    name,
  } = props;

  const { removeItem } = useContext(cartContext);

  const newPrice = displayMoney(finalPrice);
  const oldPrice = displayMoney(originalPrice);

  return (
    <>
      <div className="cart_item">
        <figure className="cart_item_img">
          <Link to={`${path}${id}`}>
            <img src={previewImg} alt="product-img" />
          </Link>
        </figure>
        <div className="cart_item_info">
          <div className="cart_item_head">
            <h4 className="cart_item_title">
              <Link to={`/product-details/${id}`}>{name}</Link>
            </h4>
            <div className="cart_item_del">
              <span onClick={() => removeItem(id)}>
                <TbTrash />
              </span>
              <div className="tooltip">Remove Item</div>
            </div>
          </div>
          <div className="cart_item_body">
            <h2 className="cart_item_price">
              {price} &nbsp;
              {/* <small>
                <del>{oldPrice}</del>
              </small> */}
            </h2>
            <div className="badge">
              <span>
                <IoMdBook /> {cateItem}
              </span>
            </div>
          </div>
          <QuantityBox itemId={id} itemQuantity={quantity} />
        </div>
      </div>
    </>
  );
};

export default CartItem;
