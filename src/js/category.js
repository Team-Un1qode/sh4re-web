import {customFetch, loadCodes} from "/js/common.js";

let assignmentValue, classValue, sortValue;

const reloadCodes = () => {
  loadCodes(sortValue, classValue, assignmentValue);
}

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
    for (let i = 0; i < data.assignments.length; i++) {
      const assignment = data.assignments[i];
      const option = document.createElement("option");
      option.value = assignment.id;
      option.textContent = assignment.title;
      categoryAssignment.appendChild(option);
    }
    categoryAssignment.addEventListener("change", function () {
      assignmentValue = this.value;
      reloadCodes();
    });
    categoryClass.addEventListener("change", function () {
      classValue = this.value;
      reloadCodes();
    });
    categorySort.addEventListener("change", function () {
      sortValue = this.value;
      reloadCodes();
    });
  } catch (e) {
    console.error("API 요청 중 에러", e);
  }
});
