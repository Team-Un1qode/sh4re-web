import { getCookie, setCookie } from "./common";
import { customFetch } from "/js/common";

document.addEventListener("DOMContentLoaded", () => {
  // DOM 요소 모음 (자주 사용되는 버튼/텍스트/폼 등을 변수화)
  const elements = {
    loginModal: document.getElementById("login-modal"),
    openLoginModalBtn: document.querySelector(".header-menu .login-btn"),
    closeLoginModalBtn: document.querySelector(".modal-close-btn"),
    loginForm: document.getElementById("login-form"),
    createCodeBtn: document.querySelector(".create-code-btn"),
    userNameDisplay: document.querySelector(".user-name-text"),
    userNameBox: document.querySelector(".user-name"),
    loginBtn: document.querySelector(".login-btn"),
    logoutBtn: document.querySelector(".logout-btn"),
  };

  let currentUsername = ""; // 현재 로그인한 사용자의 이름

  // 메인 UI 업데이트 함수
  // 로그인 상태에 따라 버튼/텍스트 등을 업데이트
  const renderMainContent = () => {
    const accessToken = getCookie("accessToken"); // 쿠키에서 로그인 토큰 확인
    currentUsername = getCookie("currentUsername") || ""; // 쿠키에서 사용자 이름 복원

    if (accessToken) {
      // 로그인 상태
      elements.createCodeBtn.classList.remove("hidden");
      elements.userNameDisplay.textContent = `${currentUsername}님`;
      elements.userNameBox.classList.remove("hidden");
      elements.loginBtn.classList.add("hidden");
      elements.logoutBtn.classList.remove("hidden");
      elements.loginModal.classList.add("hidden"); // 로그인 모달 닫기
    } else {
      // 로그아웃 상태
      elements.createCodeBtn.classList.add("hidden");
      elements.userNameBox.classList.add("hidden");
      elements.userNameDisplay.textContent = "";
      elements.loginBtn.classList.remove("hidden");
      elements.logoutBtn.classList.add("hidden");
    }
  };

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
        body: { name: username, password },
      });

      if (res.error) {
        alert("요청 중 에러가 발생했습니다.");
        return;
      }

      if (res.ok) {
        // 로그인 성공 시
        const {
          data: {
            data: { accessToken, refreshToken },
          },
        } = res;

        setCookie("accessToken", refreshToken, 30); // 토큰 저장
        setCookie("currentUsername", username, 30); // 사용자 이름 저장
        currentUsername = username; // 메모리에 사용자 이름 저장
        alert(`${username}님 환영합니다!`);
        renderMainContent(); // UI 업데이트
      } else {
        // 로그인 실패 시
        alert("ID 또는 PW가 잘못됐습니다.");
      }
    } catch (error) {
      console.error("로그인 요청 실패:", error); // 에러 로그 출력
      alert("로그인 중 문제가 발생했습니다.");
    }
  };

  // 로그아웃 처리
  // 쿠키 삭제 및 UI 업데이트
  const handleLogout = () => {
    setCookie("accessToken", "", -1); // 토큰 삭제
    setCookie("currentUsername", "", -1); // 사용자 이름 삭제
    currentUsername = ""; // 메모리에서도 초기화
    renderMainContent(); // UI 업데이트
    alert("로그아웃되었습니다.");
  };

  // 모달 관련 이벤트 초기화
  // 로그인 모달 열기/닫기 이벤트 처리
  const setupModalControls = () => {
    if (elements.openLoginModalBtn) {
      elements.openLoginModalBtn.addEventListener("click", () => {
        elements.loginModal.classList.remove("hidden"); // 모달 열기
      });
    }

    elements.closeLoginModalBtn.addEventListener("click", () => {
      elements.loginModal.classList.add("hidden"); // 모달 닫기
    });

    elements.loginModal.addEventListener("click", (event) => {
      // 모달 외부 클릭 시 닫기
      if (event.target === elements.loginModal) {
        elements.loginModal.classList.add("hidden");
      }
    });

    document.addEventListener("keydown", (event) => {
      // ESC 키 입력 시 모달 닫기
      if (
        event.key === "Escape" &&
        !elements.loginModal.classList.contains("hidden")
      ) {
        elements.loginModal.classList.add("hidden");
      }
    });
  };

  // 초기화 함수
  // 모달, 로그인/로그아웃 이벤트 설정 및 UI 초기화
  const initialize = () => {
    setupModalControls(); // 모달 이벤트 초기화
    elements.loginForm.addEventListener("submit", handleLoginSubmit); // 로그인 폼 제출 이벤트 설정
    elements.logoutBtn.addEventListener("click", handleLogout); // 로그아웃 버튼 클릭 이벤트 설정
    renderMainContent(); // 초기 UI 렌더링
  };

  initialize(); // 초기화 실행
});
