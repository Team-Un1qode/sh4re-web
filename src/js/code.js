import { customFetch } from "/js/common.js";
import hljs from "/js/highlight.js";

document.addEventListener("DOMContentLoaded", async () => {
  const codeElement = document.querySelector(".code");
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

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
