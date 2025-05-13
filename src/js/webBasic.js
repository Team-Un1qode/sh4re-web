const webBasicBtn = document.querySelector(".web-basic-btn");

if (webBasicBtn) {
  webBasicBtn.addEventListener("click", (event) => {
    event.preventDefault();
    alert("웹 기초 기능은 추후 추가될 예정입니다.");
  });
}
