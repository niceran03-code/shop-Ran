import { useEffect, useState } from "react";

// 简易登录态检测：仅检查本地是否有 accessToken
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  return { isAuthenticated };
}
