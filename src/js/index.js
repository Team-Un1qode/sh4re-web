import { customFetch } from "/js/common.js";
import hljs from "highlight.js";

document.addEventListener("DOMContentLoaded", async () => {
  const codes = await customFetch("/codes?page=1");

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
                <a href="/code?id=${code.id}" class="detail-page">
                <div class="code-text">
                    <pre><code class="language-python">${code.code}</code></pre>
                </div>
                <div class="code-information">
                    <p>${code.user.grade}${code.user.classNumber}${formattedStudentNumber}${code.user.name}(${code.user.username})</p>
                    <div class="like-box">
                        <img src="/like.svg" alt="likeIcon" width="23px" />
                        <p className="like-count">${code.likes}</p>
                    </div>
                </div>
                </a>
                `;
      document.getElementById("post-list-container").appendChild(article);
    }
    hljs.highlightAll();
  }
});

const postListBox = document.querySelector(".post-list-box");
postListBox.addEventListener("click", () => {
  document.location.href = `${code.id}`;
});
