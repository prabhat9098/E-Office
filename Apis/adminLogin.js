// adminLogin.js

// Toast notification utility
function showToast(message, type = "info") {
    const toastEl = document.getElementById("toastMessage");
    const toastText = document.getElementById("toastText");
  
    toastText.textContent = message;
  
    const toastClassMap = {
      success: "bg-success",
      error: "bg-danger",
      info: "bg-primary",
    };
  
    toastEl.className = `toast align-items-center text-white ${toastClassMap[type] || "bg-primary"} border-0`;
  
    const bsToast = new bootstrap.Toast(toastEl);
    bsToast.show();
  }
  
  // Admin login function
  function adminLogin() {
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();
  
    if (!email || !password) {
      showToast("Please enter both email and password.", "error");
      return;
    }
  
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
  
    fetch("https://eoffice.riddleescape.in/authentication/admin_login.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          showToast("Login successful!", "success");
          setTimeout(() => {
            localStorage.setItem("user", email);
            localStorage.setItem("usertype", "admin"); // <-- Add this line
            sessionStorage.setItem("admin_id", data.admin_id);
            window.location.href = "dashboard.html";
          }, 1500);
        } else {
          showToast(data.message || "Invalid credentials.", "error");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        showToast("Something went wrong. Please try again later.", "error");
      });
  }
  
  
  // Make it globally accessible
  window.adminLogin = adminLogin;
  