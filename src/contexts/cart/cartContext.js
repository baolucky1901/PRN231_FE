import React, { createContext, useReducer } from "react";
import cartReducer from "./cartReducer";

// Cart-Context
const cartContext = createContext();

const cart = JSON.parse(localStorage.getItem("cart")) ?? "";

// Initial State
const initialState = {
  cartItems: [...cart],
};

// Cart-Provider Component
const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Dispatched Actions
  const addItem = (item) => {
    return dispatch({
      type: "ADD_TO_CART",
      payload: { item },
    });
  };

  const removeItem = (itemId) => {
    return dispatch({
      type: "REMOVE_FROM_CART",
      payload: { itemId },
    });
  };

  const incrementItem = (itemId) => {
    return dispatch({
      type: "INCREMENT_ITEM",
      payload: { itemId },
    });
  };

  const decrementItem = (itemId) => {
    return dispatch({
      type: "DECREMENT_ITEM",
      payload: { itemId },
    });
  };

  // Context values
  const values = {
    ...state,
    addItem,
    removeItem,
    incrementItem,
    decrementItem,
  };

  return <cartContext.Provider value={values}>{children}</cartContext.Provider>;
};

export default cartContext;
export { CartProvider };
