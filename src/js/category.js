import { customFetch } from "/js/common.js";

const searchParams = new URLSearchParams(window.location.search);
let sortValue = searchParams.get("criteria") ?? "createdAt";
let classValue = searchParams.get("classNo") ?? "";
let assignmentValue = searchParams.get("assignmentId") ?? "";
const page = searchParams.get("page") ?? 1;

document.addEventListener("DOMContentLoaded", async () => {
  const categoryAssignment = document.querySelector(".category-assignment");
  const categoryClass = document.querySelector(".category-class");
  const categorySort = document.querySelector(".category-sort");
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
    if (categoryAssignment) categoryAssignment.value = assignmentValue;
    if (categoryClass) categoryClass.value = classValue;
    if (categorySort) categorySort.value = sortValue;
    for (let i = 0; i < data.assignments.length; i++) {
      const assignment = data.assignments[i];
      const option = document.createElement("option");
      option.value = assignment.id;
      option.textContent = assignment.title;
      categoryAssignment.appendChild(option);
    }
    categoryAssignment.addEventListener("change", function () {
      assignmentValue = this.value;
      window.location.href = `/?page=${page}&criteria=${sortValue}&classNo=${classValue}&assignmentId=${assignmentValue}`;
    });
    categoryClass.addEventListener("change", function () {
      classValue = this.value;
      window.location.href = `/?page=${page}&criteria=${sortValue}&classNo=${classValue}&assignmentId=${assignmentValue}`;
    });
    categorySort.addEventListener("change", function () {
      sortValue = this.value;
      window.location.href = `/?page=${page}&criteria=${sortValue}&classNo=${classValue}&assignmentId=${assignmentValue}`;
    });
  } catch (e) {
    console.error("API 요청 중 에러", e);
  }
});
