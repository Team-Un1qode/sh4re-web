import {getElements, handleLogout, renderMainContent, setCookie} from "./common";
import { customFetch } from "/js/common.js";
import "./status.js";

document.addEventListener("DOMContentLoaded", async () => {
  // DOM 요소 모음 (자주 사용되는 버튼/텍스트/폼 등을 변수화)
  const elements = getElements();

  // 로그인 폼 제출 처리
  // 로그인 API 호출 및 응답 처리
  const handleLoginSubmit = async (event) => {
    event.preventDefault(); // 폼 기본 동작(페이지 새로고침) 방지
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      // 로그인 API 호출
      const res = await customFetch("/api/auth/signin", {
        method: "POST",
        body: { username: username, password },
      });

      console.log("로그인 응답 데이터:", res);

      if (res.error) {
        alert("요청 중 에러가 발생했습니다.");
        return;
      }

      if (res.ok && res.data) {
        console.log(res);
        const { accessToken, refreshToken } = res.data; // 수정된 부분
        setCookie("accessToken", refreshToken, 30);
        setCookie("currentUsername", username, 30);
        alert(`${username}님 환영합니다!`);
        window.location.reload();
      } else {
        console.error("응답 데이터가 예상과 다릅니다:", res);
        alert("로그인 중 문제가 발생했습니다.(else)");
      }
    } catch (error) {
      console.error("로그인 요청 실패:", error); // 에러 로그 출력
      alert("로그인 중 문제가 발생했습니다.(catch)");
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const name = event.target.name.value;
    const password = event.target.password.value;
    const grade = parseInt(event.target.grade.value);
    const classNumber = parseInt(event.target.classNumber.value);
    const studentNumber = parseInt(event.target.studentNumber.value);

    try {
      const res = await customFetch("/api/auth/signup", {
        method: "POST",
        body: {
          username: username,
          name,
          password,
          grade,
          classNumber,
          studentNumber,
        },
      });

      console.log("회원가입 응답 데이터:", res);

      if (!res.error) {
        alert("성공적으로 회원가입이 완료되었습니다!");
        window.location.reload();
      } else {
        alert("회원가입 중 에러가 발생했습니다.(else)");
      }
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
      alert("회원가입 중 문제가 발생했습니다.(catch)");
    }
  };

  // 초기화 함수
  // 모달, 로그인/로그아웃 이벤트 설정 및 UI 초기화
  const initialize = () => {
    elements.loginForm.addEventListener("submit", handleLoginSubmit); // 로그인 폼 제출 이벤트 설정
    elements.signUpForm.addEventListener("submit", handleSignUpSubmit);
    elements.logoutBtn.addEventListener("click", handleLogout); // 로그아웃 버튼 클릭 이벤트 설정
  };

  initialize(); // 초기화 실행
});
