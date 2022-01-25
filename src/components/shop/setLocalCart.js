const setLocalCart = (shopUrl, payload) => {
  // Get data from localstorage if it exists
  const localData = localStorage.getItem("cartData")
    ? JSON.parse(localStorage.getItem("cartData"))
    : null;

  // If no data is set, set a new cart data key
  if (localData === null) {
    const p = [
      {
        shopUrl: shopUrl,
        cartItems: payload,
      },
    ];
    localStorage.setItem("cartData", JSON.stringify(p));
  } else {
    // Check if current store already exists
    const shopExists = localData.find((item) => item.shopUrl === shopUrl);

    if (shopExists == null) {
      // If current store DOES NOT exist, create new item in cartData
      const p = [
        ...localData,
        {
          shopUrl: shopUrl,
          cartItems: payload,
        },
      ];
      localStorage.setItem("cartData", JSON.stringify(p));
    } else {
      // If store already DOES exist, update cartItems array of current shopUrl
      shopExists.cartItems = payload;
      localStorage.setItem("cartData", JSON.stringify(localData));
    }
  }
};

export default setLocalCart;
