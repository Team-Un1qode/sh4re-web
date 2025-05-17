const createAcc = document.querySelector(".create-account");
const loginForm = document.querySelector(".login-form");
const signUpForm = document.querySelector(".signup-form");
const modalContent = document.querySelector(".modal-content");
let currentStatus = "로그인";

if (createAcc) {
  createAcc.addEventListener("click", () => {
    if (currentStatus === "로그인") {
      loginForm?.classList.add("hidden");
      signUpForm?.classList.remove("hidden-signup");
      createAcc.innerHTML = "계정이 있으신가요?";
      modalContent?.classList.add("expanded");
      currentStatus = "회원가입";
    } else if (currentStatus === "회원가입") {
      loginForm?.classList.remove("hidden");
      signUpForm?.classList.add("hidden-signup");
      createAcc.innerHTML = "아직 계정이 없으신가요?";
      modalContent?.classList.remove("expanded");
      currentStatus = "로그인";
    }
  });
}
