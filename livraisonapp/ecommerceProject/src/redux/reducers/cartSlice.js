import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    userCart: [],
    withoutUserCart: [],
    // Isloading: false,
    isEnabled:true,
    isLoading: false,
    // cartItems:[],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
          // console.log("Payload reçu :", action.payload);
            const { productId, price, quantity,name,images,objectId, vendorId} = action.payload;
            const existingItem = state.items.find(item => item.productId === productId);
           
            if (existingItem) {
              existingItem.quantity += quantity;
              existingItem.subTotal = existingItem.quantity * price;
            } else {
              state.items.push({
                productId,
                price,
                quantity,
                name,
                images,
                objectId,
                vendorId,
                subTotal: price * quantity,
              });
            }
          },
        setCart: (state, action) => {
            state.items = action.payload;
        },
        setCartItems: (state, action) => {
          state.userCart = action.payload;
      },
        clearCart: (state) => {
            state.items = [];
        },
        setWithoutUserCart: (state, action) => {
          state.withoutUserCart = action.payload;
        },
       
        // setCartItems: (state, action) => {
        //     state.items = action.payload;
        // },
        updateCartItemQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item.productId === productId);
            if (item) {
              item.quantity = quantity;
              item.subTotal = item.price * quantity;
            }
          },
          setIsEnabled: (state, action) => {
            state.isEnabled = action.payload;
          },
          setIsLoading:(state, action)=>{
            state.isLoading = action.payload;
          }

        // deleteCartItem:()=>{

        // }
    }
});

export const { addToCart, setCart,setCartItems, clearCart,updateCartItemQuantity, setIsEnabled, setIsLoading,setWithoutUserCart} = cartSlice.actions;

export default cartSlice.reducer;
