import {customFetch} from "/js/common.js";
import hljs from "highlight.js";

const codes = await customFetch("/codes?page=1");

if (codes.ok && codes.data) {
    for(let i = 0; i < codes.data.codes.length; i++) {
        const code = codes.data.codes[i];
        const article = document.createElement("article");
        article.className = "post-list-box";
        article.innerHTML = `
            <div class="code-text">
                <pre><code class="language-python">${code.code}</code></pre>
            </div>
            <div class="code-information">
                <p>${code.user.name}</p>
                <div class="like-box">
                    <img src="/like.svg" alt="likeIcon" width="23px" />
                    <p className="like-count">${code.likes}</p>
                </div>
            </div>
        `
        document.getElementById("post-list-container").appendChild(article);
    }
    hljs.highlightAll();
}