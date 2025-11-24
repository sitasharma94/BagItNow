document.addEventListener("DOMContentLoaded", () => {
  // --- ADD TO CART LOGIC (DB VERSION) ---
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const product = e.target.closest(".product");
      if (!product) return;

      const item = {
        name: product.querySelector("h3").textContent,
        price: product.querySelector("p").textContent,
        image: product.querySelector(".product-image").src,
      };

      const email = localStorage.getItem("userEmail");
      if (!email) {
        alert("Please log in first.");
        window.location.href = "sign.html";
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, item }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to add to cart");
        }

        alert(`${item.name} added to cart!`);
        console.log("Cart after add:", data.cart);
      } catch (err) {
        console.error("Add-to-cart error:", err);
        alert("Add to cart failed. Check console.");
      }
    });
  });

  // --- SEARCH LOGIC ---
  const searchInput = document.getElementById("search-input");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const productCards = document.querySelectorAll(".product");

      productCards.forEach((card) => {
        const productName = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = productName.includes(query) ? "block" : "none";
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");
  const email =
    localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
  const backend = "http://localhost:5000"; // change if yours is different

  let wishlist = [];

  // 1. Load wishlist from backend (if logged in)
  async function loadWishlist() {
    if (!email) return; // not logged in: you can later keep localStorage fallback if you want

    try {
      const res = await fetch(
        `${backend}/api/wishlist?email=${encodeURIComponent(email)}`
      );
      if (!res.ok) return;

      const data = await res.json();
      wishlist = data.wishlist || [];

      // set active hearts
      wishlistButtons.forEach((btn) => {
        const productId = btn.dataset.id;
        if (wishlist.includes(productId)) {
          btn.classList.add("active");
        }
      });
    } catch (err) {
      console.error("Error loading wishlist:", err);
    }
  }

  loadWishlist();

  // 2. Handle click on hearts
  wishlistButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!email) {
        alert("Please login to use wishlist.");
        return;
      }

      const productId = btn.dataset.id;
      const isActive = btn.classList.contains("active");
      const url = `${backend}/api/wishlist/${isActive ? "remove" : "add"}`;
      const method = isActive ? "DELETE" : "POST";

      // optimistic UI
      btn.classList.toggle("active");

      try {
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, productId }),
        });

        if (!res.ok) {
          btn.classList.toggle("active"); // revert on error
          console.error("Wishlist update failed");
          return;
        }

        const data = await res.json();
        wishlist = data.wishlist;
      } catch (err) {
        btn.classList.toggle("active");
        console.error("Error updating wishlist:", err);
      }
    });
  });
});
