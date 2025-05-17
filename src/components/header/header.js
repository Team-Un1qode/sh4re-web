import headerHTML from "./header.html?raw";
import {customFetch, getCookie} from "/js/common.js";

document.addEventListener("DOMContentLoaded", async () => {
  if(getCookie("accessToken") == "") return;
  const userNameText = document.querySelector(".user-name-text");
  const res = await customFetch(`/api/auth/info`, {
    method: "GET",
  });
  if (!res.ok) {
    console.error("HTTP 상태", res.status);
    const errorText = await res.text();
    console.error("서버 응답", errorText);
    return;
  }
  const data = await res.data;
  userNameText.href = `/user?id=${data.id}`;
});

document.body.insertAdjacentHTML("afterbegin", headerHTML);
