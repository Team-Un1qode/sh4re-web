import { customFetch } from "/js/common.js";
import hljs from "highlight.js";

document.addEventListener("DOMContentLoaded", async () => {
  const codes = await customFetch("/codes");

  if (codes.ok && codes.data) {
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
      document.getElementById("post-list-container").appendChild(article);
    }
    hljs.highlightAll();
  }
});
