document.addEventListener("DOMContentLoaded", () => {
  const createCodeBtn = document.querySelector(".create-code-btn");

  if (createCodeBtn) {
    createCodeBtn.addEventListener("click", () => {
      window.location.href = "write"; // write.html로 이동
    });
  }
});
