window.addEventListener("storage", () => {
  location.reload(true);
});

if (document.readystate == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  getCartFromLocalStorage();

  updateCart();

  const quantityInputs = Array.from(
    document.getElementsByClassName("cart__input")
  );
  quantityInputs.forEach((input) => {
    input.addEventListener("change", quantityChanged);
  });

  const checkoutButton = document.getElementsByClassName("checkout__btn")[0];
  checkoutButton.addEventListener("click", checkout);
}

function getCartFromLocalStorage() {
  let cartItems = JSON.parse(localStorage.getItem("cartPastries"));
  let wishlistItems =
    JSON.parse(localStorage.getItem("wishlistPastries")) || [];
  let wishlistCount = document.getElementsByClassName("wishlist__count")[0];
  let cartCount = document.getElementsByClassName("cart__count")[0];
  loadBadgeCount(cartItems, cartCount);
  loadBadgeCount(wishlistItems, wishlistCount);

  function loadBadgeCount(element, badgeCount) {
    let numItemClicked = element.length;
    badgeCount.innerText = numItemClicked;
  }

  const cartItemsRow = document.getElementsByClassName("cart--rows")[0];
  const cartItemTemplate = document.querySelector("[cart-items-template]");
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  });
  let cartPastries = [];

  cartPastries = cartItems.map((cartItem) => {
    const cartPastry = cartItemTemplate.content.cloneNode(true).children[0];
    const cartPhoto = cartPastry.getElementsByClassName("cart__photo")[0];
    const cartDescription = cartPastry.getElementsByClassName("cart__des")[0];
    const cartName = cartPastry.getElementsByClassName("cart__name")[0];
    const cartPrice = cartPastry.getElementsByClassName("product__price")[0];
    const cartTotalPrice = cartPastry.getElementsByClassName("total__price")[0];
    cartPhoto.src = cartItem.image;
    cartPhoto.alt = cartItem.description;
    cartName.textContent = cartItem.name;
    cartPrice.textContent = formatter.format(cartItem.price);
    cartPrice.value = cartItem.price;
    cartTotalPrice.textContent = formatter.format(cartItem.price);
    cartTotalPrice.value = cartItem.price;
    cartDescription.textContent = cartItem.description;

    cartItemsRow.append(cartPastry);
    let appendItemsRow = cartItemsRow.append(cartPastry);

    let emptyCart = document.getElementsByClassName("cart__empty")[0];
    if ((appendItemsRow = true)) {
      emptyCart.style.display = "none";
    }
  });
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NGN",
});

function updateCartTotal() {
  const shoppingCart = document.getElementsByClassName("shopping-cart")[0];
  const cartRow = Array.from(shoppingCart.getElementsByClassName("cart"));
  let subTotal = shoppingCart.getElementsByClassName("cart__subtotal")[0];
  let grandTotal = shoppingCart.getElementsByClassName("cart__grandtotal")[0];
  let subTotalValue = 0;
  let total = 0;

  cartRow.forEach((cart) => {
    const productPrice = cart.getElementsByClassName("product__price")[0];
    const totalPrice = cart.getElementsByClassName("total__price")[0];
    const quantityInput = cart.getElementsByClassName("cart__input")[0];
    const quantity = quantityInput.value;
    const price = parseFloat(productPrice.value);
    total = quantity * price;
    totalPrice.innerText = formatter.format(total);
    subTotalValue = subTotalValue + total;
  });
  subTotal.value = subTotalValue;
  subTotal.innerText = formatter.format(subTotalValue);
  grandTotal.innerText = formatter.format(subTotalValue);
}
updateCartTotal();

function updateCart() {
  const shoppingCart = document.getElementsByClassName("shopping-cart")[0];
  const cartRow = Array.from(shoppingCart.getElementsByClassName("cart"));
  cartRow.forEach((cart) => {
    const counter = cart.querySelector("div.cart__counter");
    const removeButton = cart.getElementsByClassName("cart__trash")[0];
    const addToWishlistButton =
      cart.getElementsByClassName("cart__wishlist")[0];
    const cartPhoto = cart.getElementsByClassName("cart__photo")[0];
    const cartDescription = cart.getElementsByClassName("cart__des")[0];
    const cartName = cart.getElementsByClassName("cart__name")[0];
    const cartPrice = cart.getElementsByClassName("product__price")[0];
    let pastryClicked = {
      image: cartPhoto.src,
      description: cartDescription.innerText,
      name: cartName.innerText,
      price: cartPrice.value,
    };
    counter.addEventListener("click", (e) => {
      if (e.target.tagName !== "I") return;
      const input = e.currentTarget.querySelector("input");
      const cartQuantity = e.target.classList.contains("item__decrease")
        ? -1
        : 1;
      input.value = Math.max(
        1,
        Math.min(100, Number(input.value) + cartQuantity)
      );
      updateCartTotal();
      // console.log(pastryDescription);
    });

    removeButton.addEventListener("click", () => {
      removeFromCart(pastryClicked);
      cart.remove();
      updateCartTotal();
      resetCartPage();
    });

    addToWishlistButton.addEventListener("click", () => {
      let wishlistSelection = [];

      if (JSON.parse(localStorage.getItem("wishlistPastries")) === null) {
        wishlistSelection.push(pastryClicked);
        saveToLocalStorage("wishlistPastries", wishlistSelection);
        updateBadgeCount("wishlist__count", "wishlistPastries");
        removeFromCart(pastryClicked);
        cart.remove();
        updateCartTotal();
        resetCartPage();
      } else {
        const wishlistStorageItems = Array.from(
          JSON.parse(localStorage.getItem("wishlistPastries"))
        );
        if (
          wishlistStorageItems.some(
            (storageItem) =>
              storageItem.description === pastryClicked.description
          )
        ) {
          alert("This Item has been added to wishlist");
          return;
        } else {
          wishlistStorageItems.forEach((storageItem) => {
            wishlistSelection.push(storageItem);
          });
        }

        wishlistSelection.push(pastryClicked);
        saveToLocalStorage("wishlistPastries", wishlistSelection);
        updateBadgeCount("wishlist__count", "wishlistPastries");
        removeFromCart(pastryClicked);
        cart.remove();
        updateCartTotal();
        resetCartPage();
      }
    });
  });
}

function quantityChanged(e) {
  let input = e.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
    alert("The minimum item limit is 1");
  } else if (isNaN(input.value) || input.value >= 101) {
    input.value = 100;
    alert("The maximum item limit is 100");
  }
  updateCartTotal();
}

function saveToLocalStorage(group, element) {
  localStorage.setItem(group, JSON.stringify(element));
}

function removeFromCart(element) {
  let cartStorageItems = JSON.parse(localStorage.getItem("cartPastries")) || [];
  let cartIndex = cartStorageItems.findIndex(
    (e) => e.description === element.description
  );
  cartStorageItems.splice(cartIndex, 1);
  saveToLocalStorage("cartPastries", cartStorageItems);
  updateBadgeCount("cart__count", "cartPastries");
}

function updateBadgeCount(element, group) {
  let count = document.getElementsByClassName(element)[0];
  let itemsInStorage = JSON.parse(localStorage.getItem(group));
  let numItemClicked;
  if (itemsInStorage == null) {
    numItemClicked = 0;
  } else {
    numItemClicked = itemsInStorage.length;
  }
  count.innerText = numItemClicked;
}

function checkout() {
  alert("Thank you for your purchase");
  localStorage.removeItem("cartPastries");
  updateBadgeCount("cart__count", "cartPastries");
  clearCart();
}

function clearCart() {
  const cartRow = Array.from(document.getElementsByClassName("cart"));
  cartRow.forEach((cart) => {
    cart.remove();
  });
  updateCartTotal();
  let emptyCart = document.getElementsByClassName("cart__empty")[0];
  emptyCart.style.display = "block";
}

function resetCartPage() {
  let cartStorageItems = JSON.parse(localStorage.getItem("cartPastries"));
  if (cartStorageItems.length == 0) {
    localStorage.removeItem("cartPastries");
    let emptyCart = document.getElementsByClassName("cart__empty")[0];
    emptyCart.style.display = "block";
  }
}
