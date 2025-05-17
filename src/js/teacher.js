import { customFetch, loadCodes } from "/js/common.js";

const searchParams = new URLSearchParams(window.location.search);
let sortValue = searchParams.get("criteria") ?? "";
let classValue = searchParams.get("classNo") ?? "";
let assignmentValue = searchParams.get("assignmentId") ?? "";

const reloadCodes = () => {
  loadCodes(sortValue, classValue, assignmentValue);
};

document.addEventListener("DOMContentLoaded", async () => {
  const taskList = document.querySelector(".task-list");
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
    if (categoryClass) categoryClass.value = classValue;
    if (categorySort) categorySort.value = sortValue;
    for (let i = 0; i < data.assignments.length; i++) {
      const assignment = data.assignments[i];
      const option = document.createElement("li");

      option.classList.add("task-item");
      option.setAttribute("data-id", assignment.id);

      if (assignment.id == assignmentValue) {
        option.classList.add("selected");
      }

      option.innerHTML = `
        <span class="task-title">${assignment.title}</span>
        <div class="detail">
          <span class="task-type">${assignment.description}</span>
          <svg
            class="edit-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"
            />
          </svg>
        </div>
      `;

      option.addEventListener("click", function (e) {
        if (e.target.closest(".edit-icon")) return;
        if (assignmentValue == this.dataset.id) {
          assignmentValue = null;
        } else {
          assignmentValue = this.dataset.id;
        }
        window.location.href = `${
          window.location.pathname
        }?criteria=${sortValue}&classNo=${classValue}&assignmentId=${
          assignmentValue ?? ""
        }`;
      });

      option
        .querySelector(".edit-icon")
        .addEventListener("click", async function (e) {
          e.stopPropagation();
          const newTitle = prompt("새 제목을 입력하세요", assignment.title);
          if (newTitle === null) return;
          const newDesc = prompt(
            "새 설명을 입력하세요",
            assignment.description
          );
          if (newDesc === null) return;

          await customFetch(`/assignments`, {
            method: "PATCH",
            body: {
              id: assignment.id,
              title: newTitle,
              description: newDesc,
            },
          });
          location.reload(true);
          reloadCodes();
        });

      taskList.appendChild(option);
    }
    categoryClass.addEventListener("change", function () {
      classValue = this.value;
      window.location.href = `${window.location.pathname}?criteria=${sortValue}&classNo=${classValue}&assignmentId=${assignmentValue}`;
    });
    categorySort.addEventListener("change", function () {
      sortValue = this.value;
      window.location.href = `${window.location.pathname}?criteria=${sortValue}&classNo=${classValue}&assignmentId=${assignmentValue}`;
    });
  } catch (e) {
    console.error("API 요청 중 에러", e);
  }
});
