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

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    console.log(`로그인 시도: 아이디 - ${username}`);
    alert(
      `${username}님, 로그인 시도되었습니다. 입력된 비밀번호는 ${password}입니다`
    );

    loginModal.classList.add("hidden");
    loginForm.reset();
  });
});
