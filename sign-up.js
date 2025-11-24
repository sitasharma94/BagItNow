// sign-up.js

const backend = "http://localhost:5000";

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!fullName.value.trim()) {
    alert("Please enter your full name");
    return;
  }

  if (!email.value.trim()) {
    alert("Please enter your email");
    return;
  }

  if (!password.value.trim()) {
    alert("Please enter a password");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch(`${backend}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value.trim(),
        password: password.value.trim(),
        name: fullName.value.trim()
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    alert("Signup successful!");
    window.location.href = "sign.html";

  } catch (err) {
    console.error(err);
    alert("Network error. Check server.");
  }
});
