import hljs from "highlight.js";

document.addEventListener("DOMContentLoaded", async () => {
  setupModalControls();
  await renderMainContent();
});

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
  alert("로그아웃되었습니다.");
  window.location.reload();
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
  document.querySelector(".create-code-btn")?.classList.add("hidden");
  document.querySelector(".user-name")?.classList.add("hidden");
  const userNameDisplay = document.querySelector(".user-name-text");
  if (userNameDisplay) userNameDisplay.textContent = "";
  document.querySelector(".login-btn")?.classList.remove("hidden");
  document.querySelector(".logout-btn")?.classList.add("hidden");
};

const setStatusLoggedIn = (currentUsername) => {
  document.querySelector(".create-code-btn")?.classList.remove("hidden");
  const userNameDisplay = document.querySelector(".user-name-text");
  if (userNameDisplay) userNameDisplay.textContent = `${currentUsername}님`;
  document.querySelector(".user-name")?.classList.remove("hidden");
  document.querySelector(".login-btn")?.classList.add("hidden");
  document.querySelector(".logout-btn")?.classList.remove("hidden");
  document.getElementById("login-modal")?.classList.add("hidden");
};

export const setupModalControls = () => {
  const loginModal = document.getElementById("login-modal");
  const openLoginModalBtn = document.querySelector(".header-menu .login-btn");
  const closeLoginModalBtn = document.querySelector(".modal-close-btn");

  openLoginModalBtn?.addEventListener("click", () => {
    loginModal?.classList.remove("hidden");
  });

  closeLoginModalBtn?.addEventListener("click", () => {
    loginModal?.classList.add("hidden");
  });

  loginModal?.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.classList.add("hidden");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      loginModal &&
      !loginModal.classList.contains("hidden")
    ) {
      loginModal.classList.add("hidden");
    }
  });
};

export const loadCodes = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("page") ?? "1";
  const criteria = urlParams.get("criteria") ?? "";
  const classNo = urlParams.get("classNo") ?? "";
  const assignmentId = urlParams.get("assignmentId") ?? "";
  const list = document.getElementById("post-list-container");
  const codes = await customFetch(
    `/codes?page=${page}&criteria=${criteria}&classNo=${classNo}&assignmentId=${assignmentId}`
  );

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
    return codes.data.totalPages;
  }
};

export function formatISOToKoreanDate(isoString) {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());

  return `${year}년 ${month}월 ${day}일`;
}

export function escapeHTML(str) {
  return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}