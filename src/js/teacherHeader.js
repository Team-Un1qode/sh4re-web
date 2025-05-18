import { customFetch } from "/js/common.js";

document.addEventListener("DOMContentLoaded", async () => {
  const icon = document.getElementById("icon");
  const iconBox = document.getElementById("icon-box");
  try {
    const res = await customFetch(`/api/auth/info`, { method: "GET" });
    if (res.data?.role === "TEACHER") {
      if (icon) icon.src = "/te4cherIcon.svg";
      if (iconBox) iconBox.href = "/teacher";
      return;
    }
  } catch (e) {
    console.error("API 요청 중 에러", e);
  }
});
