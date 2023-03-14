import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { BsCartX, BsArrowLeft } from "react-icons/bs";
import { calculateTotal } from "../helpers/utils";
import useDocTitle from "../hooks/useDocTitle";
import cartContext from "../contexts/cart/cartContext";
import CartItem from "../components/cart/CartItem";
import EmptyView from "../components/common/EmptyView";
import { UseAuth } from "../contexts/auth/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// import checkedImage from "./checked.png";
import BackDrop from "../components/backdrop/BackDrop";

const Cart = () => {
  useDocTitle("Cart");
  const navigate = useNavigate();

  const { user } = UseAuth();
  // console.log("User: ", user._id);

  const { cartItems, clearItem } = useContext(cartContext);
  console.log("cart: ", cartItems);
  const [loading, setLoading] = useState(false);

  const cartQuantity = cartItems.length;

  const [inputValues, setInputValues] = useState("");

  //payment method
  const [selectedItem, setSelectedItem] = useState("COD");

  const handleClick = (item) => {
    setSelectedItem(item);
  };

  // total original price
  const cartTotal = cartItems.map((item) => {
    return item.price * item.quantity;
  });

  const calculateCartTotal = calculateTotal(cartTotal) + 30000;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedItem === "COD") {
      setLoading(true);
      const dataPayment = {
        totalPrice: calculateCartTotal,
        shippingAddress: inputValues,
        customerId: user._id,
        paymentMethod: "COD",
      };
      const res = await fetch(
        "https://localhost:44301/api/orders/order/cod-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataPayment),
        }
      );
      const dataRes = await res.json();
      try {
        const promises = cartItems.map((item) => {
          const dataOrderDetail = {
            orderId: dataRes.data,
            ebookId: item.ebookId === undefined ? null : item.ebookId,
            bookId: item.bookId === undefined ? null : item.bookId,
            comboBookId:
              item.comboBookId === undefined ? null : item.comboBookId,
            quantity: item.quantity,
          };
          console.log("dataOrderDetail", dataOrderDetail);
          return fetch(
            "https://localhost:44301/api/order-details/order-detail",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dataOrderDetail),
            }
          );
        });
        const response = await Promise.all(promises);
        if (response != null) {
          toast.success("Your order create successfully");
          setLoading(false);
          clearItem();
          navigate("/");
        } else {
          toast.error("Make order failed!");
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (selectedItem === "VNPay") {
      setLoading(true);
      const dataPayment = {
        totalPrice: calculateCartTotal,
        shippingAddress: inputValues,
        customerId: user._id,
      };
      const res = await fetch(
        "https://localhost:44301/api/orders/order/online-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataPayment),
        }
      );
      const dataRes = await res.json();
      const url = dataRes.data.url;
      try {
        const promises = cartItems.map((item) => {
          const dataOrderDetail = {
            orderId: dataRes.data.orderId,
            ebookId: item.cateItem === "E-Book" ? item.id : null,
            bookId: item.cateItem !== "E-Book" ? item.id : null,
            comboBookId: null,
            quantity: item.quantity,
          };
          // console.log("dataOrderDetail", dataOrderDetail);
          return fetch(
            "https://localhost:44301/api/order-details/order-detail",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dataOrderDetail),
            }
          );
        });
        const response = await Promise.all(promises);
        if (response !== null) {
          window.open(url);
          setLoading(false);
          clearItem();
          navigate("/");
        } else {
          toast.error("Make order failed!");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {loading ? (
        <BackDrop />
      ) : (
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
                  <div className="cart_left_wrapper">
                    <div className="cart_left_shop">
                      <Link to="/">
                        <BsArrowLeft /> &nbsp; Continue Shopping
                      </Link>
                    </div>
                    <div className="cart_left_col">
                      {cartItems.map((item) => (
                        <CartItem key={item.id} {...item} />
                      ))}
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="cart_right_col">
                      <div className="order_summary">
                        <h3>
                          Order Summary &nbsp; ( {cartQuantity}{" "}
                          {cartQuantity > 1 ? "items" : "item"} )
                        </h3>
                        <div className="order_summary_details">
                          <div className="discount">
                            <span>Discount</span>
                            <b>- 0VNĐ</b>
                          </div>
                          <div className="delivery">
                            <span>Delivery</span>
                            <b>30,000VNĐ</b>
                          </div>
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
                                value={inputValues}
                                onChange={(e) => setInputValues(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="payment_method">
                            <div className="payment">
                              <label htmlFor="VNPay" className="box first">
                                <input
                                  type="radio"
                                  id="VNPay"
                                  name="item"
                                  checked={selectedItem === "VNPay"}
                                  onChange={() => handleClick("VNPay")}
                                />
                                <img src="../public/vnpaylogo" alt="" />
                                <div className="detail">
                                  {/* <span className="circle_icon"></span>  */}
                                  <div className="detail-description">
                                    <span className="detail-title">VNPay</span>
                                    <span className="detail-detail">
                                      Make payments via VNPay. Orders will be
                                      shipped after payment has been made
                                    </span>
                                  </div>
                                </div>
                              </label>
                              <label htmlFor="tienmat" className="box second">
                                <input
                                  type="radio"
                                  id="tienmat"
                                  name="item"
                                  checked={selectedItem === "COD"}
                                  onChange={() => handleClick("COD")}
                                />
                                <div className="detail">
                                  <div className="detail-description">
                                    <span className="detail-title">
                                      Cash on Delivery
                                    </span>
                                    <span className="detail-detail">
                                      Pay the deliverer or shipper using cash or
                                      card
                                    </span>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                          <div className="separator"></div>
                          <div className="total_price">
                            <b>
                              <small>Total Price</small>
                            </b>
                            <b>{calculateCartTotal}VNĐ</b>
                          </div>
                        </div>
                        <button type="submit" className="btn checkout_btn">
                          Checkout
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Cart;
