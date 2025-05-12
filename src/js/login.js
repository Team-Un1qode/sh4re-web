import { getCookie, setCookie } from "./common";
import { customFetch } from "/js/common";

document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("login-modal");
  const openLoginModalBtn = document.querySelector(".header-menu .login-btn");
  const closeLoginModalBtn = loginModal.querySelector(".modal-close-btn");
  const loginForm = document.getElementById("login-form");
  const createCodeBtn = document.querySelector(".create-code-btn");
  const userNameDisplay = document.querySelector(".user-name-text");
  const userNameBox = document.querySelector(".user-name");
  const loginBtn = document.querySelector(".login-btn");
  const logoutBtn = document.querySelector(".logout-btn");

  let currentUsername = "";

  function renderMainContent() {
    const accessToken = getCookie("accessToken");
    currentUsername = getCookie("currentUsername") || "";

    if (accessToken) {
      createCodeBtn.classList.remove("hidden");
      userNameDisplay.textContent = `${currentUsername}님`;
      userNameBox.classList.remove("hidden");
      loginBtn.classList.add("hidden");
      logoutBtn.classList.remove("hidden");
    } else {
      createCodeBtn.classList.add("hidden");
      userNameBox.classList.add("hidden");
      userNameDisplay.textContent = "";
      loginBtn.classList.remove("hidden");
      logoutBtn.classList.add("hidden");
    }
  }

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
      const {
        data: {
          data: { accessToken, refreshToken },
        },
      } = res;

      setCookie("accessToken", refreshToken, 30);
      setCookie("currentUsername", username, 30);
      currentUsername = username;
      alert(`${username}님 환영합니다!`);
      renderMainContent();
      loginModal.classList.add("hidden");
    } else {
      alert("ID 또는 PW가 잘못됐습니다.");
    }
  });

  logoutBtn.addEventListener("click", () => {
    setCookie("accessToken", "", -1);
    setCookie("currentUsername", "", -1);
    currentUsername = "";
    renderMainContent();
    alert("로그아웃되었습니다.");
  });

  document.addEventListener("DOMContentLoaded", () => {
    renderMainContent();
  });
});
