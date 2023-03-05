const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const newItemId = action.payload.item.id;
      const itemExist = state.cartItems.some((item) => item.id === newItemId);
      //   const itemCateExist = state.cartItems.some(
      //     (item) => item.cateItem === action.payload.item.cateItem
      //   );

      let updatedCartItems = null;

      if (itemExist) {
        updatedCartItems = state.cartItems.map((item) => {
          if (item.id === newItemId) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });
      } else {
        updatedCartItems = [...state.cartItems, action.payload.item];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCartItems));

      return {
        ...state,
        cartItems: updatedCartItems,
      };

    case "REMOVE_FROM_CART":
      const removeItem = state.cartItems.filter(
        (item) => item.id !== action.payload.itemId
      );
      localStorage.setItem("cart", JSON.stringify(removeItem));
      return {
        ...state,
        cartItems: removeItem,
      };

    case "CLEAR_CART":
      localStorage.setItem("cart", JSON.stringify([]));
      return {
        ...state,
        cartItems: [],
      };

    case "INCREMENT_ITEM":
      const increment = state.cartItems.map((item) => {
        if (item.id === action.payload.itemId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(increment));
      return {
        ...state,
        cartItems: increment,
      };

    case "DECREMENT_ITEM":
      const decrement = state.cartItems
        .map((item) => {
          if (item.id === action.payload.itemId) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        })
        .filter((item) => item.quantity !== 0);
      localStorage.setItem("cart", JSON.stringify(decrement));

      return {
        ...state,
        cartItems: decrement,
      };

    default:
      return state;
  }
};

export default cartReducer;
