import { createSlice } from "@reduxjs/toolkit";

// Get cart from localStorage
const getCartFromStorage = () => {
  if (typeof window !== "undefined") {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

// Save cart to localStorage
const saveCartToStorage = (items) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
};

const initialState = {
  items: getCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(
        (i) => i.productId === item.productId,
      );

      if (existingItem) {
        // Update quantity (don't exceed stock)
        existingItem.quantity = Math.min(
          existingItem.quantity + (item.quantity || 1),
          item.stock || 99,
        );
      } else {
        state.items.push({
          productId: item.productId,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity || 1,
          stock: item.stock,
        });
      }
      saveCartToStorage(state.items);
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveCartToStorage(state.items);
    },

    // Update item quantity
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock || 99));
      }
      saveCartToStorage(state.items);
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

export default cartSlice.reducer;
