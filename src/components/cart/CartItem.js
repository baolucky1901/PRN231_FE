import React, { useContext } from "react";
import { TbTrash } from "react-icons/tb";
import { Link } from "react-router-dom";
import cartContext from "../../contexts/cart/cartContext";
import QuantityBox from "../common/QuantityBox";
import { IoMdBook } from "react-icons/io";
import { check } from "../common/QuantityBox";

const CartItem = (props) => {
  const {
    bookId,
    comboBookId,
    ebookId,
    previewImg,
    quantity,
    path,
    cateItem,
    price,
    name,
  } = props;
  // console.log("id", id);
  const { removeItem } = useContext(cartContext);

  const handleRemove = () => {
    if (check(bookId)) {
      removeItem({ bookId: bookId, isBookId: true });
      return;
    }
    if (check(comboBookId)) {
      removeItem({ comboBookId: comboBookId, isComboBook: true });
      return;
    }
    if (check(ebookId)) {
      removeItem({ ebookId: ebookId, isEBook: true });
      return;
    }
  };

  return (
    <>
      <div className="cart_item">
        <figure className="cart_item_img">
          <Link to={`${path}${bookId}`}>
            <img src={previewImg} alt="product-img" />
          </Link>
        </figure>
        <div className="cart_item_info">
          <div className="cart_item_head">
            <h4 className="cart_item_title">
              <Link to={`/product-details/${bookId}`}>{name}</Link>
            </h4>
            <div className="cart_item_del">
              <span onClick={() => handleRemove()}>
                <TbTrash />
              </span>
              <div className="tooltip">Remove Item</div>
            </div>
          </div>
          <div className="cart_item_body">
            <h2 className="cart_item_price">{price} VNĐ &nbsp;</h2>
            <div className="badge">
              <span>
                <IoMdBook />
              </span>
            </div>
          </div>
          <QuantityBox
            bookId={bookId}
            itemQuantity={quantity}
            cart={cateItem}
            comboBookId={comboBookId}
            ebookId={ebookId}
          />
        </div>
      </div>
    </>
  );
};

export default CartItem;
