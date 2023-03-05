import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { dropdownMenu } from "../../data/headerData";
import commonContext from "../../contexts/common/commonContext";
import cartContext from "../../contexts/cart/cartContext";
import AccountForm from "../form/AccountForm";
import SearchBar from "./SearchBar";
import { UseAuth } from "../../contexts/auth/AuthContext";

const Header = () => {
  const { user, logOut } = UseAuth();
  // console.log("User Header: ", user);

  const { toggleForm, toggleSearch } = useContext(commonContext);
  const { cartItems } = useContext(cartContext);
  const [isSticky, setIsSticky] = useState(false);

  const handleLogOut = async () => {
    try {
      await logOut();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // handle the sticky-header
  useEffect(() => {
    const handleIsSticky = () =>
      window.scrollY >= 50 ? setIsSticky(true) : setIsSticky(false);

    window.addEventListener("scroll", handleIsSticky);

    return () => {
      window.removeEventListener("scroll", handleIsSticky);
    };
  }, [isSticky]);

  const cartQuantity = cartItems.length;

  return (
    <>
      <header id="header" className={isSticky ? "sticky" : ""}>
        <div className="container">
          <div className="navbar">
            <h2 className="nav_logo">
              <Link to="/">J4F-ITBook</Link>
            </h2>
            <nav className="nav_actions">
              <div className="search_action">
                <span onClick={() => toggleSearch(true)}>
                  <AiOutlineSearch />
                </span>
                <div className="tooltip">Search</div>
              </div>

              <div className="cart_action">
                {Object.keys(user).length === 0 ? (
                  <>
                    <span onClick={() => toggleForm(true)}>
                      <AiOutlineShoppingCart />
                      {cartQuantity > 0 && (
                        <span className="badge">{cartQuantity}</span>
                      )}
                    </span>
                    <div className="tooltip">Cart</div>
                  </>
                ) : (
                  <>
                    <Link to="/cart">
                      <AiOutlineShoppingCart />
                      {cartQuantity > 0 && (
                        <span className="badge">{cartQuantity}</span>
                      )}
                    </Link>
                    <div className="tooltip">Cart</div>
                  </>
                )}
              </div>

              <div className="user_action">
                <span>
                  <AiOutlineUser />
                </span>
                <div className="dropdown_menu">
                  <h4>
                    Hello!
                    {user && <Link to="*">&nbsp;{user.unique_name}</Link>}
                  </h4>
                  <p>Access account and manage orders</p>
                  <>
                    {Object.keys(user).length === 0 ? (
                      <button type="button" onClick={() => toggleForm(true)}>
                        Login / Signup
                      </button>
                    ) : (
                      <button type="button" onClick={handleLogOut}>
                        Logout
                      </button>
                    )}
                  </>
                  <div className="separator"></div>
                  <ul>
                    {dropdownMenu.map((item) => {
                      const { id, link, path } = item;
                      return (
                        <li key={id}>
                          <Link to={path}>{link}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <SearchBar />
      <AccountForm />
    </>
  );
};

export default Header;
