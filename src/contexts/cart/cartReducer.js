const cartReducer = (state, action) => {
  const { item } = action.payload;
  switch (action.type) {
    case "ADD_TO_CART":
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
      let removeItem;
      if (item.isBookId) {
        removeItem = state.cartItems.filter(
          (newItem) => newItem.bookId !== item.bookId
        );
      }
      if (item.isEBook) {
        removeItem = state.cartItems.filter(
          (newItem) => newItem.ebookId !== item.ebookId
        );
      }
      if (item.isComboBook) {
        removeItem = state.cartItems.filter(
          (newItem) => newItem.comboBookId !== item.comboBookId
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
