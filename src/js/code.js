import { customFetch } from "/js/common.js";
import hljs from "/js/highlight.js";

document.addEventListener("DOMContentLoaded", async () => {
  const codeElement = document.querySelector(".code");
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const titleBox = document.querySelector(".title");
  const descriptionBox = document.querySelector(".description");
  const userInformationBox = document.querySelector(".user-info");

  try {
    const res = await customFetch(`/codes/${postId}`, {
      method: "GET",
    });
    if (!res.ok) {
      console.error("HTTP 상태", res.status);
      const errorText = await res.text();
      console.error("서버 응답", errorText);
      return;
    }
    const data = await res.data;
    const formattedStudentNumber = String(data.user.studentNumber).padStart(
      2,
      "0"
    );
    titleBox.innerText = `${data.title}`;
    descriptionBox.innerText = `${data.description}`;
    userInformationBox.innerText = `${data.user.grade}${data.user.classNumber}${formattedStudentNumber}${data.user.name}(${data.user.username})`;
    if (data && data.code) {
      codeElement.textContent = data.code;
      await hljs.highlightAll();
    } else {
      console.error("서버에서 유효한 코드 데이터를 반환X");
    }
  } catch (e) {
    console.error("API 요청 중 에러", e);
  }
});
