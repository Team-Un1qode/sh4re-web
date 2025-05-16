import headerHTML from "./header.html?raw";
import { customFetch } from "/js/common.js";

// document.addEventListener("DOMContentLoaded", async () => {
//   const userName = document.querySelector(".user-name");
//   const userNameText = document.createElement("div");
//   const res = await customFetch(`/api/auth/info`, {
//     method: "GET",
//   });
//   if (!res.ok) {
//     console.error("HTTP 상태", res.status);
//     const errorText = await res.text();
//     console.error("서버 응답", errorText);
//     return;
//   }
//   userNameText.className = "user-name-text";
//   userNameText.innerHTML = `<a href="/user?id=${res.data.id}">${res.data.username}</a>`;
//   userName.appendChild(userNameText);
// });

document.body.insertAdjacentHTML("afterbegin", headerHTML);
