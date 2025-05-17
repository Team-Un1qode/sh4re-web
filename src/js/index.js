import { customFetch, loadCodes } from "/js/common.js";

const urlParams = new URLSearchParams(window.location.search);
let totalPages = 1;
let page = +urlParams.get("page") ?? 1;

const renderPages = () => {
  if(page < 1) page = 1;
  const weight = Math.floor((page-1) / 5);
  const start = weight * 5 + 1;
  const pageList = document.querySelector(".page-list");
  pageList.innerHTML = "";
  for(let i = start; i < start + 5; i++){
    if(i > totalPages) break;
    const pageButton = document.createElement("button");
    if(i === page) {
      pageButton.classList.add("active");
    }
    pageButton.classList.add("page-button");
    pageButton.dataset.page = i;
    pageButton.innerText = i;
    pageButton.addEventListener("click", function () {
      page = +this.dataset.page;
      window.location.href = `/?page=${page}`;
    })
    pageList.appendChild(pageButton);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  totalPages = await loadCodes();
  renderPages();
});

document.querySelector(".prev-page").addEventListener("click", function () {
  if(page <= 1) return;
  page--;
  window.location.href = `/?page=${page}`;
  // renderPages();
})

document.querySelector(".next-page").addEventListener("click", function () {
  if(page >= totalPages) return;
  page++;
  window.location.href = `/?page=${page}`;
  // renderPages();
})
