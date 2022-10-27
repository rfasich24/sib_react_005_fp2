import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  products: [],
  carts: [],
  recap: [],
  login: [],
  amount: 0,
  total: 0,
};

export const getProducts = createAsyncThunk("products/getProducts", async () => {
  if (JSON.parse(localStorage.getItem("products"))) {
    return JSON.parse(localStorage.getItem("products"));
  }
  const response = await axios.get(`https://fakestoreapi.com/products`);
  return response.data.map((item) => {
    if (!item.quantity) {
      item["stock"] = 10;
    }
    return item;
  });
});

export const loginUser = createAsyncThunk("products/loginUser", async ({ username, password, redirect, isLogin }) => {
  try {
    if (isLogin) {
      return isLogin;
    }
    const resPost = await axios.post("https://fakestoreapi.com/auth/login", {
      username: username !== "" ? username : " ",
      password: password !== "" ? password : " ",
    });
    const resGet = await axios.get("https://fakestoreapi.com/users");
    let find = resGet.data.find((res) => res.username === username);

    if (resPost.data.token) {
      redirect(true);
      return { id: find.id, user: `${find.name.firstname} ${find.name.lastname}`, token: resPost.data.token, login: true };
    }
  } catch (error) {
    console.log(error);
  }
});

const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    cartsExist: (state, action) => {
      state.carts = action.payload;
      localStorage.setItem("carts", JSON.stringify(state.carts));
    },
    addCart: (state, action) => {
      const { carts, products, login } = state;
      const { id, quantity } = action.payload;
      const cartLogin = carts.filter((cart) => cart.idUser === login.id);
      const existCart = cartLogin.find((cart) => cart.product.idProduct === id);
      const existProduct = products.find((product) => product.id === id);
      if (existCart && existProduct) {
        const cartItem = carts.find((cart) => cart.product.idProduct === id);
        cartItem.product.quantity = quantity ? quantity : cartItem.product.quantity + 1;
        existProduct.stock -= 1;
      } else {
        existProduct.stock -= quantity;
        carts.push({ idUser: login.id, product: { idProduct: id, quantity: quantity } });
      }
      localStorage.setItem("carts", JSON.stringify(carts));
      localStorage.setItem("products", JSON.stringify(products));
    },
    removeItem: (state, action) => {
      const { id, quantity } = action.payload;
      const cartLogin = state.carts.filter((cart) => cart.idUser === state.login.id);
      const exist = cartLogin.find((cart) => cart.product.idProduct === id);
      const existProduct = state.products.find((product) => product.id === id);
      if (existProduct && exist.product.quantity === 1) {
        state.carts = state.carts.filter((cart) => cart.product.idProduct !== id);
        existProduct.stock += quantity;
      } else {
        const cartItem = state.carts.find((cart) => cart.product.idProduct === id);
        cartItem.product.quantity = cartItem.product.quantity - 1;
        existProduct.stock += 1;
      }
      localStorage.setItem("carts", JSON.stringify(state.carts));
      localStorage.setItem("products", JSON.stringify(state.products));
    },
    checkoutItem: (state, action) => {
      state.recap.push(action.payload);
      state.carts = [];
      state.amount = 0;
      state.total = 0;
      localStorage.setItem("carts", JSON.stringify(state.carts));
      localStorage.setItem("recap", JSON.stringify(state.recap));
    },
    calculateTotal: (state, action) => {
      let amount = 0;
      let total = 0;
      for (let item of state.carts) {
        const cart = state.products.find((product) => product.id === item.product.idProduct);
        if (cart) {
          total += cart.price * item.product.quantity;
          amount += item.product.quantity;
        }
      }

      state.amount = amount;
      state.total = total;
    },
    logoutUser: (state, action) => {
      state.login = [];
      localStorage.removeItem("login");
    },
  },
  extraReducers: {
    [getProducts.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getProducts.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
      localStorage.setItem("products", JSON.stringify(action.payload));
    },
    [loginUser.pending]: (state, action) => {
      state.isLoading = true;
      state.login = [];
    },
    [loginUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.login = action.payload;
      localStorage.setItem("login", JSON.stringify(action.payload));
    },
  },
});

export const { addCart, removeItem, calculateTotal, checkoutItem, logoutUser, cartsExist } = productSlice.actions;
export default productSlice.reducer;
