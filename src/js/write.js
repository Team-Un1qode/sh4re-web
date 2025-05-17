import { customFetch, getCookie } from "/js/common.js";

if (!getCookie("accessToken")) {
  alert("로그인 후 접근해주세요.");
  document.location.href = "/";
}

const title = document.querySelector(".title");
const code = document.querySelector(".code");
const shareBtn = document.querySelector(".share");
let loading = false;

document.addEventListener("DOMContentLoaded", async () => {
  const categoryAssignment = document.querySelector(".category-assignment");
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
      const option = document.createElement("option");
      option.value = assignment.id;
      option.textContent = assignment.title;
      categoryAssignment.appendChild(option);
    }
  } catch (e) {
    console.error("API 요청 중 에러", e);
  }
});

const handleSubmit = async (e) => {
  const assignment = document.getElementById("category-assignment");
  const assignmentValue = assignment.options[assignment.selectedIndex].value;
  e.preventDefault();
  if (loading) return;
  if (!title.value || !code.value) return;
  try {
    loading = true;
    shareBtn.innerText = "로딩 중..";
    const res = await customFetch("/codes", {
      method: "POST",
      body: {
        title: title.value,
        code: code.value,
        field: "PYTHON",
        assignmentId: assignmentValue,
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
