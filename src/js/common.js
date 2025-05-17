import hljs from "highlight.js";

let elements = {};

document.addEventListener("DOMContentLoaded", async () => {
  elements = getElements();
  setupModalControls();
  await renderMainContent();
});

export const getElements = () => {
  return {
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
};

export const customFetch = async (
  url,
  option = {
    method: "GET",
  }
) => {
  try {
    const { method, body } = option;
    const token = getCookie("accessToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("API 요청 중 에러 발생:", e);
    return { ok: false, data: null, error: e };
  }
};

export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const handleLogout = async () => {
  setCookie("accessToken", "", -1);
  setCookie("currentUsername", "", -1);
  await renderMainContent();
  alert("로그아웃되었습니다.");
};

export const renderMainContent = async () => {
  try {
    const accessToken = getCookie("accessToken");

    let currentUsername = getCookie("currentUsername");

    if (currentUsername) setStatusLoggedIn(currentUsername);
    else setStatusLoggedOut();

    if (accessToken) {
      let res = await customFetch("/api/auth/info", { method: "GET" });

      if (!res.ok && res.data?.code === "INVALID_TOKEN") {
        return handleLogout();
      }

      if (res.ok && res.data && res.data.name) {
        currentUsername = res.data.username;
        setStatusLoggedIn(currentUsername);
      } else {
        setStatusLoggedOut();
        await handleLogout();
        console.error("사용자 정보 가져오기 실패:", res);
      }
    }
  } catch (error) {
    console.error("renderMainContent 에러:", error);
  }
};

const setStatusLoggedOut = () => {
  elements.createCodeBtn.classList.add("hidden");
  elements.userNameBox.classList.add("hidden");
  elements.userNameDisplay.textContent = "";
  elements.loginBtn.classList.remove("hidden");
  elements.logoutBtn.classList.add("hidden");
};

const setStatusLoggedIn = (currentUsername) => {
  elements.createCodeBtn.classList.remove("hidden");
  elements.userNameDisplay.textContent = `${currentUsername}님`;
  elements.userNameBox.classList.remove("hidden");
  elements.loginBtn.classList.add("hidden");
  elements.logoutBtn.classList.remove("hidden");
  elements.loginModal.classList.add("hidden"); // 로그인 모달 닫기
};

export const setupModalControls = () => {
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


export const loadCodes = async (criteria = "createdAt", classNo = "", assignmentId= "") => {
  const list = document.getElementById("post-list-container");
  const codes = await customFetch(`/codes?criteria=${criteria}&classNo=${classNo}&assignmentId=${assignmentId}`);

  if (codes.ok && codes.data) {
    list.innerHTML = "";
    for (let i = 0; i < codes.data.codes.length; i++) {
      const code = codes.data.codes[i];
      const article = document.createElement("article");
      const formattedStudentNumber = String(code.user.studentNumber).padStart(
          2,
          "0"
      );
      article.className = "post-list-box";
      article.innerHTML = `
                <div class="code-text">
                <a href="/code?id=${code.id}" class="detail-page">
                  <pre><code class="language-python">${code.code}</code></pre>
                </div>
                </a>
                <div class="code-information">
                  <div class="info-box">
                    <a href="/code?id=${code.id}" class="detail-page">
                      <p class="title">${code.title}</p>
                    </a>
                    <a href="/user?id=${code.user.id}" class="detail-page">
                      <p class="student-info">${code.user.grade}${code.user.classNumber}${formattedStudentNumber}${code.user.name}(${code.user.username})</p>
                    </a>
                  </div>
                  <div class="like-box">
                    <img src="/like.svg" alt="likeIcon" width="23px" />
                    <p className="like-count" id="code-likes">${code.likes}</p>
                  </div>
                </div>
                `;
      list.appendChild(article);
    }
    hljs.highlightAll();
  }
}