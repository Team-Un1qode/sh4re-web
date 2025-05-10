import { customFetch } from "/js/common";

document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("login-modal");
  const openLoginModalBtn = document.querySelector(".header-menu .login-btn");
  const closeLoginModalBtn = loginModal.querySelector(".modal-close-btn");
  const loginForm = document.getElementById("login-form");

  if (openLoginModalBtn) {
    openLoginModalBtn.addEventListener("click", () => {
      loginModal.classList.remove("hidden");
    });
  }
  closeLoginModalBtn.addEventListener("click", () => {
    loginModal.classList.add("hidden");
  });

  loginModal.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.classList.add("hidden");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !loginModal.classList.contains("hidden")) {
      loginModal.classList.add("hidden");
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    const res = await customFetch("/api/auth/signin", {
      method: "POST",
      body: { name: username, password },
    });
    if (res.error) {
      alert("요청 중 에러가 발생했습니다.");
      return;
    }

    if (res.ok) {
      console.log(res.data);
      // cookie 설정
    } else {
      alert("ID 또는 PW가 잘못됐습니다.");
      // loginModal.classList.add("hidden");
      // loginForm.reset();
    }
  });
});
