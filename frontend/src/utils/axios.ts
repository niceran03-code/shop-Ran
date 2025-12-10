import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// 请求拦截器，加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器，处理 401 过期
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 如果 accessToken 过期
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axios.post("http://localhost:3000/auth/refresh", {
          refreshToken,
        });

        // 保存新的 accessToken
        localStorage.setItem("accessToken", res.data.accessToken);

        // 重新发起原请求（带新 token）
        api.defaults.headers.common.Authorization = `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch (e) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
