export const customFetch = async (url, option) => {
  try {
    const { method, body } = option;
    const token = getCookie("accessToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("API 요청 중 에러 발생:", e);
    return { ok: false, data: null, error: e };
  }
};

export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
