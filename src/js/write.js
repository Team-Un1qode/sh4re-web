import { customFetch, getCookie } from "/js/common.js";

if (!getCookie("accessToken")) {
  alert("로그인 후 접근해주세요.");
  document.location.href = "/";
}

const title = document.querySelector(".title");
const code = document.querySelector(".code");
const shareBtn = document.querySelector(".share");
let loading = false;

const handleSubmit = async (e) => {
  console.log(title.value, code.value);
  e.preventDefault();
  if (loading) return;
  if (!title.value || !code.value) return;
  try {
    loading = true;
    shareBtn.innerText = "로딩 중..";
    const res = await customFetch("/codes", {
      method: "POST",
      body: {
        title: title.value,
        code: code.value,
        field: "PYTHON",
      },
    });
    if (res.ok && res.data) {
      alert("코드 작성에 성공하였습니다.");
      document.location.href = `/code?id=${res.data.id}`;
    }
  } finally {
    shareBtn.innerText = "코드 공유";
    loading = false;
  }
};

shareBtn.addEventListener("click", handleSubmit);
