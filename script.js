window.addEventListener("storage", () => {
  // When local storage changes do something like a refresh
  window.location.href = window.location.href;
});


import { pastries } from "./pastries.js";


let itemsInCart = JSON.parse(localStorage.getItem("cartPastries")) || [];
let itemsInWishlist =
  JSON.parse(localStorage.getItem("wishlistPastries")) || [];

//updating badge count on windows load
let wishlistCount = document.getElementsByClassName("wishlist__count")[0];
let cartCount = document.getElementsByClassName("cart__count")[0];
loadBadgeCount(itemsInCart, cartCount);
loadBadgeCount(itemsInWishlist, wishlistCount);

const pastryItemsGrid = document.getElementsByClassName("store__items")[0];
const PastryItemsTemplate = document.querySelector("[data-items-template]");
let storeItems = [];

storeItems = pastries.map((pastry) => {
  // cloning and copying template for each array object
  const pastryItems = PastryItemsTemplate.content.cloneNode(true).children[0];
  const addToWishlistBtn =
    pastryItems.getElementsByClassName("store__wishlist")[0];
  const addToCartBtn = pastryItems.getElementsByClassName("store__cart")[0];
  const pastryDescription = pastryItems.getElementsByClassName(
    "pastry__description"
  )[0];
  const pastryProduct =
    pastryItems.getElementsByClassName("pastry__product")[0];
  const pastryPrice = pastryItems.getElementsByClassName("pastry__price")[0];
  const pastryImage = pastryItems.getElementsByClassName("pastry__image")[0];
  const pastryPlural = pastry.productPlural;
  pastryImage.src = pastry.imgSrc;
  pastryImage.alt = pastry.description;
  pastryProduct.textContent = pastry.product;
  pastryPrice.textContent = pastry.price;
  pastryDescription.textContent = pastry.description;

  pastryItemsGrid.append(pastryItems);

  return {
    name: pastry.product,
    namePlural: pastryPlural,
    image: pastry.imgSrc,
    description: pastry.description,
    price: pastry.price,
    wishlist: addToWishlistBtn,
    cart: addToCartBtn,
    element: pastryItems,
  };
});

// formatting selected currency on each price
function currencyFormat() {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  });
  const prices = Array.from(document.getElementsByClassName("prices"));
  prices.forEach((price) => {
    price.value = parseFloat(price.innerText);
    price.innerText = formatter.format(price.innerText);
  });
}
currencyFormat();

// making search input to get cleared on windows onload
const navLink = Array.from(document.getElementsByClassName("nav-link"));
const searchInput = document.getElementsByClassName("search__input")[0];
const searchButton = document.getElementById("search__button");
window.addEventListener("load", () => {
  searchInput.value = "";
});

// Initializing navLinks, searchButton, searchInput, cartButton, wishlistButton
storeItems.forEach((storeItem) => {
  navLink.forEach((nav) => {
    function activeNav() {
      const navLinkName = nav.textContent.toLowerCase();
      const searchInputs = searchInput.value.toLowerCase();
      const searchedNav =
        navLinkName === searchInputs ||
        navLinkName === `${searchInputs}s` ||
        navLinkName === `${searchInputs.slice(0, -1)}`;
      nav.classList.toggle("active-link", searchedNav);
    }

    nav.addEventListener("click", () => {
      const clickedNav = nav.textContent;
      const pluralClickedNav = clickedNav && clickedNav === `${clickedNav}s`;
      //  console.log(`${clickedNav}s`)
      const displayClickedNav =
        clickedNav === storeItem.name.toLowerCase() ||
        clickedNav === storeItem.namePlural.toLowerCase();
      nav.classList.toggle("active-link", pluralClickedNav);
      storeItem.element.classList.toggle("hide", !displayClickedNav);
    });

    searchInput.addEventListener("input", (e) => {
      const input = e.target.value;
      const isVisible =
        storeItem.name.toLowerCase().includes(input) ||
        storeItem.namePlural.toLowerCase().includes(input);
      storeItem.element.classList.toggle("hide", !isVisible);
      const otherNav = nav.textContent !== "all" && nav.textContent !== "home";
      if (input === "") {
        nav.classList.toggle("active-link", !otherNav);
      }
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchButton.click();
        activeNav();
      }
    });

    searchButton.addEventListener("click", () => {
      const searchedProduct =
        storeItem.name.toLowerCase() === searchInput.value ||
        storeItem.namePlural.toLowerCase() === searchInput.value;
      storeItem.element.classList.toggle("hide", !searchedProduct);
      activeNav();
    });
  });

  let pastryClicked = {
    image: storeItem.image,
    description: storeItem.description,
    name: storeItem.name,
    price: storeItem.price,
  };

  storeItem.cart.addEventListener("click", () => {
    let cartSelection = [];
    if (JSON.parse(localStorage.getItem("cartPastries")) === null) {
      cartSelection.push(pastryClicked);
      saveToLocalStorage("cartPastries", cartSelection);
      updateBadgeCount("cartPastries", cartCount);
    } else {
      const cartStorageItems = Array.from(JSON.parse(localStorage.getItem("cartPastries")));
      if (
        cartStorageItems.some(
          (storageItem) => storageItem.description === pastryClicked.description
        )
      ) {
        alert("This Item has been added to cart");
        return;
      } else {
        cartStorageItems.forEach((storageItem) => {
          cartSelection.push(storageItem);
        });
      }
  
      cartSelection.push(pastryClicked);
      saveToLocalStorage("cartPastries", cartSelection);
      updateBadgeCount("cartPastries", cartCount);
    }
  });

  storeItem.wishlist.addEventListener("click", () => {
    let wishlistSelection = [];
    if (JSON.parse(localStorage.getItem("wishlistPastries")) === null) {
      wishlistSelection.push(pastryClicked);
      saveToLocalStorage("wishlistPastries", wishlistSelection);
      updateBadgeCount("wishlistPastries", wishlistCount);
    } else {
      const wishlistStorageItems = Array.from(JSON.parse(localStorage.getItem("wishlistPastries")));
      if (
        wishlistStorageItems.some(
          (storageItem) => storageItem.description === pastryClicked.description
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
      updateBadgeCount("wishlistPastries", wishlistCount);
    }
  });
});

function loadBadgeCount(element, badgeCount) {
  let numItemClicked = element.length;
  badgeCount.innerText = numItemClicked;
}

function updateBadgeCount(element, badgeCount) {
  let itemsInStorage = JSON.parse(localStorage.getItem(element)) || [];
  let numItemClicked = itemsInStorage.length;
  badgeCount.innerText = numItemClicked;
}

function saveToLocalStorage(group, element) {
  localStorage.setItem(group, JSON.stringify(element));
}


