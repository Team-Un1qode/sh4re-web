import { customFetch } from "/js/common.js";

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
      const option = document.createElement("option");
      const assignment = data.assignments[i];
      option.innerHTML = `<option value="${assignment.id}">${assignment.title}</option>`;
      categoryAssignment.appendChild(option);
    }
  } catch (e) {
    console.error("API 요청 중 에러", e);
  }
});
