// sign.js

const backend = "http://localhost:5000";

const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = emailEl.value.trim();
  const password = passEl.value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${backend}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // store user email
    localStorage.setItem("userEmail", email);

    alert("Login successful!");
    window.location.href = "shop.html";

  } catch (err) {
    alert("Network error");
    console.error(err);
  }
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "sign-up.html";
});
