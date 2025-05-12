import { getCookie, setCookie } from "./common";
import { customFetch } from "/js/common";

document.addEventListener("DOMContentLoaded", () => {
  // DOM 요소 모음 (자주 사용되는 버튼/텍스트/폼 등을 변수화)
  const elements = {
    loginModal: document.getElementById("login-modal"),
    openLoginModalBtn: document.querySelector(".header-menu .login-btn"),
    closeLoginModalBtn: document.querySelector(".modal-close-btn"),
    loginForm: document.getElementById("login-form"),
    signUpForm: document.getElementById("signup-form"),
    createCodeBtn: document.querySelector(".create-code-btn"),
    userNameDisplay: document.querySelector(".user-name-text"),
    userNameBox: document.querySelector(".user-name"),
    loginBtn: document.querySelector(".login-btn"),
    logoutBtn: document.querySelector(".logout-btn"),
  };

  let currentUsername = ""; // 현재 로그인한 사용자의 이름

  // 메인 UI 업데이트 함수
  // 로그인 상태에 따라 버튼/텍스트 등을 업데이트
  const renderMainContent = async () => {
    try {
      const accessToken = getCookie("accessToken"); // 쿠키에서 Access Token 확인
      console.log("Access Token:", accessToken); // 디버깅 로그

      currentUsername = ""; // 기본값 초기화

      if (accessToken) {
        let res = await customFetch("/api/auth/info", { method: "GET" });
        console.log("사용자 정보 응답 데이터:", res);

        // Access Token이 만료된 경우
        if (!res.ok && res.data?.code === "INVALID_TOKEN") {
          console.warn(
            "Access Token이 유효하지 않습니다. Refresh Token을 사용해 갱신합니다."
          );
          const refreshToken = getCookie("refreshToken"); // Refresh Token 가져오기
          console.log("Refresh Token:", refreshToken);

          // Refresh Token으로 새로운 Access Token 요청
          const refreshRes = await customFetch("/api/auth/refresh", {
            method: "POST",
            body: { refreshToken },
          });

          if (refreshRes.ok && refreshRes.data) {
            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = refreshRes.data;
            console.log("새로운 Access Token:", newAccessToken);

            // 새로운 토큰 저장
            setCookie("accessToken", newAccessToken, 30);
            setCookie("refreshToken", newRefreshToken, 30);

            res = await customFetch("/api/auth/info", { method: "GET" });
          } else {
            console.error(
              "Refresh Token으로 Access Token 갱신 실패:",
              refreshRes
            );
            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
            return;
          }
        }

        // 사용자 정보 가져오기 성공
        if (res.ok && res.data && res.data.name) {
          currentUsername = res.data.username;
          console.log("사용자 이름:", currentUsername);
        } else {
          console.error("사용자 정보 가져오기 실패:", res);
        }
      }

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
    } catch (error) {
      console.error("renderMainContent 에러:", error);
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
        renderMainContent();
      } else {
        console.error("응답 데이터가 예상과 다릅니다:", res);
        alert("로그인 중 문제가 발생했습니다.(else)");
      }
    } catch (error) {
      console.error("로그인 요청 실패:", error); // 에러 로그 출력
      alert("로그인 중 문제가 발생했습니다.(catch)");
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
      } else {
        alert("회원가입 중 에러가 발생했습니다.(else)");
        return;
      }
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
      alert("회원가입 중 문제가 발생했습니다.(catch)");
    }
  };

  // 초기화 함수
  // 모달, 로그인/로그아웃 이벤트 설정 및 UI 초기화
  const initialize = () => {
    setupModalControls(); // 모달 이벤트 초기화
    elements.loginForm.addEventListener("submit", handleLoginSubmit); // 로그인 폼 제출 이벤트 설정
    elements.signUpForm.addEventListener("submit", handleSignUpSubmit);
    elements.logoutBtn.addEventListener("click", handleLogout); // 로그아웃 버튼 클릭 이벤트 설정
    renderMainContent(); // 초기 UI 렌더링
  };

  initialize(); // 초기화 실행
});
