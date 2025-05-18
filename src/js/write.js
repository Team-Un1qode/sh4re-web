import { customFetch, getCookie, escapeHTML } from "/js/common.js";
import hljs from "/js/highlight.js";

if (!getCookie("accessToken")) {
  alert("로그인 후 접근해주세요.");
  document.location.href = "/";
}

const title = document.querySelector(".title-box");
const codeInput = document.querySelector(".code-input");
const code = document.querySelector(".code");
const shareBtn = document.querySelector(".share");
let previousAssignmentSelect;
let loading = false;
let assignmentId;

document.addEventListener("DOMContentLoaded", async () => {
  hljs.highlightAll();
  const assignmentList = document.querySelector(".assignment-list");
  try {
    const res = await customFetch(`/assignments`, {
      method: "GET",
    });
    if (!res.ok) {
      console.error("HTTP 상태", res.status);
      const errorText = await res.text();
      console.error("서버 응답", errorText);
      return;
    }
    const data = await res.data;

    for (let i = 0; i < data.assignments.length; i++) {
      const assignment = data.assignments[i];
      const li = document.createElement("li");
      li.className = "assignment";
      li.innerHTML = `
        <div class="assignment-info">
            <h3>${assignment.title}</h3>
            <h4>${assignment.description}</h4>
          </div>
          <button class="assignment-select">
            과제 선택
          </button>
        </div>
      `;
      li.querySelector(".assignment-select").addEventListener("click", function () {
        if(previousAssignmentSelect) {
          previousAssignmentSelect.classList.remove("selected");
          previousAssignmentSelect.innerText = "과제 선택";
          assignmentId = null;
        }
        if (previousAssignmentSelect === this) {
          previousAssignmentSelect = null;
          return;
        }
        previousAssignmentSelect = this;
        this.classList.add("selected");
        this.innerText = "선택 취소";
        assignmentId = assignment.id;
      })
      assignmentList.appendChild(li);
    }
  } catch (e) {
    console.error("API 요청 중 에러", e);
  }
});

const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;
  if (!title.value || !codeInput.value) return;
  try {
    loading = true;
    shareBtn.innerText = "로딩 중..";
    const res = await customFetch("/codes", {
      method: "POST",
      body: {
        title: title.value,
        code: codeInput.value,
        field: "PYTHON",
        assignmentId,
      },
    });
    if (res.ok && res.data) {
      alert("코드 작성에 성공하였습니다.");
      document.location.href = `/code?id=${res.data.id}`;
    }
  } finally {
    shareBtn.innerText = "코드 공유";
    loading = false;
  }
};



shareBtn.addEventListener("click", handleSubmit);
codeInput.addEventListener("input", (e) => {
  code.innerHTML= escapeHTML(e.target.value);
  code.dataset.highlighted = "";
  hljs.highlightElement(code);
})
codeInput.addEventListener("scroll", (e) => {
  code.scrollTop = e.target.scrollTop;
})