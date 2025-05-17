import { handleLogout, setCookie } from "/js/common";
import { customFetch } from "/js/common.js";
import "/js/status.js";

document.addEventListener("DOMContentLoaded", async () => {
  const logInForm = document.querySelector(".login-form");
  const signUpForm = document.querySelector(".signup-form");
  const logOutBtn = document.querySelector(".logout-btn");

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const res = await customFetch("/api/auth/signin", {
        method: "POST",
        body: { username: username, password },
      });

      if (res.error) {
        alert("요청 중 에러가 발생했습니다.");
        return;
      }

      if (res.ok && res.data) {
        const { refreshToken } = res.data;
        setCookie("accessToken", refreshToken, 30);
        setCookie("currentUsername", username, 30);
        window.location.reload();
      } else {
        console.error("응답 데이터가 예상과 다릅니다:", res);
        alert("아이디/비밀번호가 다릅니다.");
      }
    } catch (error) {
      console.error("로그인 요청 실패:", error);
      alert("로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const name = event.target.name.value;
    const password = event.target.password.value;
    const grade = +event.target.grade.value;
    const classNumber = +event.target.classNumber.value;
    const studentNumber = +event.target.studentNumber.value;

    try {
      const res = await customFetch("/api/auth/signup", {
        method: "POST",
        body: {
          username,
          name,
          password,
          grade,
          classNumber,
          studentNumber,
        },
      });

      if (!res.error) {
        alert(`환영합니다 ${username}님!`);
        const signUpLogIn = await customFetch("/api/auth/signin", {
          method: "POST",
          body: { username, password },
        });

        const { refreshToken } = signUpLogIn.data;
        setCookie("accessToken", refreshToken, 30);
        setCookie("currentUsername", username, 30);
        window.location.reload();
      } else {
        alert("회원가입 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
      alert("회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  logInForm.addEventListener("submit", handleLoginSubmit);
  signUpForm.addEventListener("submit", handleSignUpSubmit);
  logOutBtn.addEventListener("click", handleLogout);
});
