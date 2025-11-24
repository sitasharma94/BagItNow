// cart.js — frontend cart that uses backend endpoints
(() => {
  const backend = "http://localhost:5000"; // change if needed
  const email =
    localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

  const listEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const proceedBtn = document.getElementById("proceed-btn");

  if (!listEl || !totalEl) {
    console.error("cart.js: missing DOM elements");
    return;
  }

  if (!email) {
    listEl.innerHTML =
      '<li class="empty">You must be logged in to view the cart. <a href="sign.html">Log in</a></li>';
    totalEl.textContent = "₹ 0.00";
    if (proceedBtn) {
      proceedBtn.onclick = () => alert("Please log in first.");
    }
    return;
  }

  async function fetchCart() {
    try {
      const res = await fetch(
        `${backend}/api/cart/get?email=${encodeURIComponent(email)}`
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Cart GET failed", res.status, txt);
        listEl.innerHTML = `<li class="empty">Failed to load cart.</li>`;
        totalEl.textContent = "₹ 0.00";
        return;
      }
      const data = await res.json();
      const cart = Array.isArray(data.cart) ? data.cart : [];
      renderCart(cart);
    } catch (err) {
      console.error("Network error fetching cart:", err);
      listEl.innerHTML = `<li class="empty">Network error loading cart.</li>`;
      totalEl.textContent = "₹ 0.00";
    }
  }

  function renderCart(cart) {
    listEl.innerHTML = "";

    if (!cart.length) {
      listEl.innerHTML = '<li class="empty">Your cart is empty.</li>';
      totalEl.textContent = "₹ 0.00";
      localStorage.setItem("cartTotal", "0.00");
      return;
    }

    let total = 0;
    cart.forEach((item, idx) => {
      const name = item.name || "Unnamed";
      const priceText = item.price == null ? "₹ 0" : String(item.price);
      const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;
      total += price;

      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <img src="${item.image || ""}" alt="${name}">
        <div class="item-details">
          <div><strong>${name}</strong></div>
          <div>${priceText}</div>
        </div>
        <button class="remove-btn" data-index="${idx}">Remove</button>
      `;
      listEl.appendChild(li);
    });

    totalEl.textContent = `₹ ${total.toFixed(2)}`;
    localStorage.setItem("cartTotal", total.toFixed(2));
  }

  async function removeItem(index) {
    try {
      const res = await fetch(`${backend}/api/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, index }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Remove failed", res.status, txt);
        alert("Failed to remove item (server).");
        return;
      }
      await fetchCart();
    } catch (err) {
      console.error("Network error removing item:", err);
      alert("Network error");
    }
  }

  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-btn");
    if (!btn) return;
    const idx = Number(btn.getAttribute("data-index"));
    if (Number.isNaN(idx)) return;
    removeItem(idx);
  });

  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      const total = parseFloat(localStorage.getItem("cartTotal") || "0");
      if (total <= 0) {
        alert("Your cart is empty.");
      } else {
        window.location.href = "payment.html";
      }
    });
  }

  window.addToCart = async function (item) {
    if (!item || !item.name) {
      console.error("addToCart: invalid item", item);
      alert("Invalid item.");
      return;
    }
    try {
      const res = await fetch(`${backend}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, item }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Add failed", res.status, txt);
        alert("Failed to add item to cart.");
        return;
      }
      await fetchCart();
      alert("Added to cart");
    } catch (err) {
      console.error("Network error adding item:", err);
      alert("Network error");
    }
  };

  fetchCart();
})();
