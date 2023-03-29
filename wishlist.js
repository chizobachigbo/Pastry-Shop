window.addEventListener("storage", () => {
  location.reload(true);
});

if (document.readystate == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  getWishlistFromLocalStorage();

  updateWishlist();
}

function getWishlistFromLocalStorage() {
  let cartItems = JSON.parse(localStorage.getItem("cartPastries")) || [];
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

  const wishlistItemsRow = document.getElementsByClassName("wishlist--rows")[0];
  const wishlistItemTemplate = document.querySelector(
    "[wishlist-items-template]"
  );
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  });
  let wishlistPastries = [];

  wishlistPastries = wishlistItems.map((wishlistItem) => {
    const wishlistPastry =
      wishlistItemTemplate.content.cloneNode(true).children[0];
    const wishlistPhoto =
      wishlistPastry.getElementsByClassName("wishlist__photo")[0];
    const wishlistDescription =
      wishlistPastry.getElementsByClassName("wishlist__des")[0];
    const wishlistName =
      wishlistPastry.getElementsByClassName("wishlist__name")[0];
    const wishlistPrice =
      wishlistPastry.getElementsByClassName("wishlist__price")[0];
    wishlistPhoto.src = wishlistItem.image;
    wishlistPhoto.alt = wishlistItem.description;
    wishlistName.textContent = wishlistItem.name;
    wishlistPrice.textContent = formatter.format(wishlistItem.price);
    wishlistPrice.value = wishlistItem.price;
    wishlistDescription.textContent = wishlistItem.description;

    wishlistItemsRow.append(wishlistPastry);
    let appendItemsRow = wishlistItemsRow.append(wishlistPastry);
    let wishlistHeader = document.getElementsByClassName("wishlist__header")[0];

    let emptyWishlist = document.getElementsByClassName("wishlist__empty")[0];
    if ((appendItemsRow = true)) {
      emptyWishlist.style.display = "none";
      wishlistHeader.style.display = "grid";
    }
  });
}

function updateWishlist() {
  // const wishlistParent = document.getElementsByClassName("wishlist")[0];
  const wishlistRow = Array.from(
    document.getElementsByClassName("wishlist__container ")
  );
  wishlistRow.forEach((wishlist) => {
    const removeButton = wishlist.getElementsByClassName("wishlist__trash")[0];
    const addToCartButton =
      wishlist.getElementsByClassName("wishlist__cart")[0];
    const wishlistPhoto = wishlist.getElementsByClassName("wishlist__photo")[0];
    const wishlistDescription =
      wishlist.getElementsByClassName("wishlist__des")[0];
    const wishlistName = wishlist.getElementsByClassName("wishlist__name")[0];
    const wishlistPrice = wishlist.getElementsByClassName("wishlist__price")[0];
    let pastryClicked = {
      image: wishlistPhoto.src,
      description: wishlistDescription.innerText,
      name: wishlistName.innerText,
      price: wishlistPrice.value,
    };

    removeButton.addEventListener("click", () => {
      removeFromWishlist(pastryClicked);
      wishlist.remove();
      resetWishlistPage();
    });

    addToCartButton.addEventListener("click", () => {
      console.log(pastryClicked);
      let cartSelection = [];

        if (JSON.parse(localStorage.getItem("cartPastries")) === null) {
          cartSelection.push(pastryClicked);
          saveToLocalStorage("cartPastries", cartSelection);
          updateBadgeCount("cart__count", "cartPastries");
          removeFromWishlist(pastryClicked);
          wishlist.remove();
          resetWishlistPage();

        } else {
          const cartStorageItems = Array.from(
            JSON.parse(localStorage.getItem("cartPastries"))
          );
          if (
            cartStorageItems.some(
              (storageItem) =>
                storageItem.description === pastryClicked.description
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
          updateBadgeCount("cart__count", "cartPastries");
          removeFromWishlist(pastryClicked);
          wishlist.remove();
          resetWishlistPage();
        }
    });
  });
}

function saveToLocalStorage(group, element) {
  localStorage.setItem(group, JSON.stringify(element));
}

function updateBadgeCount(element, group) {
  let count = document.getElementsByClassName(element)[0];
  let itemsInStorage = JSON.parse(localStorage.getItem(group)) || [];
  let numItemClicked;
  if (itemsInStorage == null) {
    numItemClicked = 0;
  }else{
    numItemClicked = itemsInStorage.length;
  }
  count.innerText = numItemClicked;
}

function removeFromWishlist(element) {
  let wishlistStorageItems =
    JSON.parse(localStorage.getItem("wishlistPastries")) || [];
  let wishlistIndex = wishlistStorageItems.findIndex(
    (e) => e.description === element.description
  );
  wishlistStorageItems.splice(wishlistIndex, 1);
  saveToLocalStorage("wishlistPastries", wishlistStorageItems);
  updateBadgeCount("wishlist__count", "wishlistPastries");
}


function resetWishlistPage(){
  let wishlistStorageItems =  JSON.parse(localStorage.getItem("wishlistPastries"));
  if(wishlistStorageItems.length == 0){
    localStorage.removeItem("wishlistPastries");
    let emptyWishlist = document.getElementsByClassName("wishlist__empty")[0];
    let wishlistHeader = document.getElementsByClassName("wishlist__header")[0];
    emptyWishlist.style.display = "block";
    wishlistHeader.style.display = "none";
  }
}