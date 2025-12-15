//frontend/src/utils/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Axios 实例：附带 Bearer token，401 时尝试刷新后重放请求
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
        // 当前认证页路由为 /auth
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
