import React, { useContext, useState } from "react";
import { BsCartX } from "react-icons/bs";
import { calculateTotal, displayMoney } from "../helpers/utils";
import useDocTitle from "../hooks/useDocTitle";
import cartContext from "../contexts/cart/cartContext";
import CartItem from "../components/cart/CartItem";
import EmptyView from "../components/common/EmptyView";
import useForm from "../hooks/useForm";
// import checkedImage from "./checked.png";

const Cart = () => {
  useDocTitle("Cart");

  const { cartItems } = useContext(cartContext);

  const cartQuantity = cartItems.length;

  const { inputValues, handleInputValues, handleFormSubmit } = useForm();

  //payment method
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClick = (item) => {
    setSelectedItem(item);
  };

  // total original price
  const cartTotal = cartItems.map((item) => {
    return item.originalPrice * item.quantity;
  });

  const calculateCartTotal = calculateTotal(cartTotal);
  const displayCartTotal = displayMoney(calculateCartTotal);

  // total discount
  const cartDiscount = cartItems.map((item) => {
    return (item.originalPrice - item.finalPrice) * item.quantity;
  });

  const calculateCartDiscount = calculateTotal(cartDiscount);
  const displayCartDiscount = displayMoney(calculateCartDiscount);

  // final total amount
  const totalAmount = calculateCartTotal - calculateCartDiscount;
  const displayTotalAmount = displayMoney(totalAmount);

  return (
    <>
      <section id="cart" className="section">
        <div className="container">
          {cartQuantity === 0 ? (
            <EmptyView
              icon={<BsCartX />}
              msg="Your Cart is Empty"
              link="/all-products"
              btnText="Start Shopping"
            />
          ) : (
            <div className="wrapper cart_wrapper">
              <div className="cart_left_col">
                {cartItems.map((item) => (
                  <CartItem key={item.id} {...item} />
                ))}
              </div>

              <div className="cart_right_col">
                <div className="order_summary">
                  <h3>
                    Order Summary &nbsp; ( {cartQuantity}{" "}
                    {cartQuantity > 1 ? "items" : "item"} )
                  </h3>
                  <div className="order_summary_details">
                    <div className="price">
                      <span>Original Price</span>
                      <b>{displayCartTotal}</b>
                    </div>
                    <div className="discount">
                      <span>Discount</span>
                      <b>- {displayCartDiscount}</b>
                    </div>
                    <div className="delivery">
                      <span>Delivery</span>
                      <b>Free</b>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                      <div className="shipping_address">
                        <span>Shipping Address</span>
                        <div className="input_box">
                          <textarea
                            type="text"
                            name="username"
                            placeholder="Ex: place number + street name + ward + district"
                            cols={25}
                            rows={7}
                            className="input_field"
                            value={inputValues.username || ""}
                            onChange={handleInputValues}
                            required
                          />
                        </div>
                      </div>
                      <div className="payment_method">
                        {/* <div className="payment">
                                                        <span style={{minWidth: '160px'}}>Payment Method</span>
                                                    </div>
                                                    <div style={{minWidth: '310px'}}>
                                                        <ul className="list">
                                                            {items.map((item) => (
                                                            <li key={item.id}>
                                                                <input
                                                                type="radio"
                                                                id={`item${item.id}`}
                                                                name="item"
                                                                checked={selectedItem === item.value}
                                                                onChange={() => handleClick(item.value)}
                                                                />
                                                                <label htmlFor={`item${item.id}`}>{item.value}</label>
                                                                {selectedItem === item.value && (
                                                                <div className="content">{item.content}</div>
                                                                )}
                                                            </li>
                                                            ))}
                                                        </ul>
                                                    </div> */}
                        {/* <span>Payment Method</span> */}
                        <div className="payment">
                          <label htmlFor="VNPay" class="box first">
                            <input
                              type="radio"
                              id="VNPay"
                              name="item"
                              checked={selectedItem === "VNPay"}
                              onChange={() => handleClick("VNPay")}
                            />
                            <img src="../public/vnpaylogo" alt="" />
                            <div class="detail">
                              {/* <span class="circle_icon"></span>  */}
                              <div class="detail-description">
                                <span class="detail-title">VNPay</span>
                                <span class="detail-detail">
                                  Make payments via VNPay. Orders will be
                                  shipped after payment has been made
                                </span>
                              </div>
                            </div>
                          </label>
                          <label htmlFor="tienmat" class="box second">
                            <input
                              type="radio"
                              id="tienmat"
                              name="item"
                              checked={selectedItem === "tienmat"}
                              onChange={() => handleClick("tienmat")}
                            />
                            <div class="detail">
                              {/* <span class="circle_icon"></span> */}
                              <div class="detail-description">
                                <span class="detail-title">
                                  Cash on Delivery
                                </span>
                                <span class="detail-detail">
                                  Pay the deliverer or shipper using cash or
                                  card
                                </span>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </form>
                    <div className="separator"></div>
                    <div className="total_price">
                      <b>
                        <small>Total Price</small>
                      </b>
                      <b>{displayTotalAmount}</b>
                    </div>
                  </div>
                  <button type="submit" className="btn checkout_btn">
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Cart;
