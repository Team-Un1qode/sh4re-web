import { customFetch } from "/js/common.js";
import "/styles/user.scss"
import hljs from "/js/highlight.js";

document.addEventListener("DOMContentLoaded", async () => {
  const studentName = document.querySelector(".school-name");
  const username = document.getElementById("user-name");
  const postListContainer = document.getElementById("post-list-container");
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");

  try {
    const res = await customFetch(`/users/${userId}`, {
      method: "GET",
    });
    if (!res.ok) {
      console.error("HTTP 상태", res.status);
      return;
    }
    const data = res.data;
    const formattedStudentNumber = String(data.studentNumber).padStart(2, "0");
    if (studentName)
      studentName.innerText = `${data.grade}${data.classNumber}${formattedStudentNumber}${data.name}`;
    if (username) username.innerText = `${data.username}`;

    const codeList = data.codeList;
    if (Array.isArray(codeList) && postListContainer) {
      for (let i = 0; i < codeList.length; i++) {
        const code = codeList[i];
        const article = document.createElement("article");
        article.className = "post-list-box";
        article.innerHTML = `
          <div class="code-text">
            <a href="/code?id=${code.id}" class="detail-page">
              <pre><code class="language-python">${code.code}</code></pre>
            </a>
          </div>
          <div class="code-information">
            <div class="info-box">
              <a href="/code?id=${code.id}" class="detail-page">
                <p class="title">${code.title}</p>
              </a>
              <p class="student-info">${data.grade}${data.classNumber}${formattedStudentNumber}${data.name}(${data.username})</p>
            </div>  
            <div class="like-box">
              <img src="/like.svg" alt="likeIcon" width="23px" />
              <p class="like-count" id="code-likes">${code.likes}</p>
            </div>
          </div>
        `;
        postListContainer.appendChild(article);
      }
      hljs.highlightAll();
    }
  } catch (e) {
    console.error("API 요청 중 에러", e);
  }
});
