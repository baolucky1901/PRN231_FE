const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const { item } = action.payload;
      const newItemId = item.bookId || item.ebookId || item.comboBookId;
      const itemExist = state.cartItems.some(
        (item) =>
          item.bookId === newItemId ||
          item.ebookId === newItemId ||
          item.comboBookId === newItemId
      );

      let updatedCartItems = itemExist
        ? state.cartItems.map((cartItem) => ({
            ...cartItem,
            quantity:
              cartItem.bookId === newItemId ||
              cartItem.ebookId === newItemId ||
              cartItem.comboBookId === newItemId
                ? cartItem.quantity + 1
                : cartItem.quantity,
          }))
        : [...state.cartItems, item];

      localStorage.setItem("cart", JSON.stringify(updatedCartItems));

      return {
        ...state,
        cartItems: updatedCartItems,
      };

    case "REMOVE_FROM_CART":
      const { item: item2 } = action.payload;
      let removeItem;
      if (item2.isBookId) {
        removeItem = state.cartItems.filter(
          (newItem) => newItem.bookId !== item2.bookId
        );
      }
      if (item2.isEBook) {
        removeItem = state.cartItems.filter(
          (newItem) => newItem.ebookId !== item2.ebookId
        );
      }
      if (item2.isComboBook) {
        removeItem = state.cartItems.filter(
          (newItem) => newItem.comboBookId !== item2.comboBookId
        );
      }

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
