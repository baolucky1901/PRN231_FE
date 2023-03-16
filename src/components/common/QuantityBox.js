import React, { useContext } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import cartContext from "../../contexts/cart/cartContext";

const QuantityBox = (props) => {
  const { bookId, itemQuantity, comboBookId, ebookId, bookAmount } = props;

  const { incrementItem, decrementItem } = useContext(cartContext);
  // console.log("Cart items idEBook: ", cart);
  console.log("baInQuantityBox", bookAmount);
  const handleIncrement = () => {
    if (check(bookId)) {
      incrementItem(bookId);
      return;
    }
    if (check(comboBookId)) {
      incrementItem(comboBookId);
      return;
    }
    if (check(ebookId)) {
      incrementItem(ebookId);
      return;
    }
  };

  const handleDecrement = () => {
    if (check(bookId)) {
      decrementItem(bookId);
      return;
    }
    if (check(comboBookId)) {
      decrementItem(comboBookId);
      return;
    }
    if (check(ebookId)) {
      decrementItem(ebookId);
      return;
    }
  };

  return (
    <>
      <div className="quantity_box">
        <button
          type="button"
          onClick={() => handleDecrement()}
          disabled={!check(bookId)}
        >
          <FaMinus />
        </button>
        <span className="quantity_count">{itemQuantity}</span>
        <button
          type="button"
          onClick={() => handleIncrement()}
          disabled={!check(bookId) || itemQuantity >= bookAmount}
        >
          <FaPlus />
        </button>
      </div>
    </>
  );
};

export const check = (item) => {
  if (item) {
    return item !== null || item !== undefined;
  }
  return false;
};

export default QuantityBox;
