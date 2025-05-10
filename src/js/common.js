export const customFetch = async (url, option) => {
  try {
    const { method, body } = option;
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    const result = {
      ok: res.ok,
      data: await res.json(),
      error: null,
    };
    return result;
  } catch (e) {
    console.log(`${url} 요청 중 에러 발생.`, e);
    return {
      ok: false,
      data: null,
      error: e,
    };
  }
};
