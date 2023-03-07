import React, { useContext } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import cartContext from "../../contexts/cart/cartContext";

const QuantityBox = (props) => {
  const { itemId, itemQuantity, cart } = props;

  const { incrementItem, decrementItem } = useContext(cartContext);
  // console.log("Cart items idEBook: ", cart);

  return (
    <>
      <div className="quantity_box">
        <button
          type="button"
          onClick={() => decrementItem(itemId)}
          disabled={cart === "E-Book"}
        >
          <FaMinus />
        </button>
        <span className="quantity_count">{itemQuantity}</span>
        <button
          type="button"
          onClick={() => incrementItem(itemId)}
          disabled={itemQuantity >= 5 || cart === "E-Book"}
        >
          <FaPlus />
        </button>
      </div>
    </>
  );
};

export default QuantityBox;
