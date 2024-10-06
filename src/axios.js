import axios from 'axios';

// 設定基本的 API base URL
axios.defaults.baseURL = import.meta.env.VITE_API_HOST || 'http://localhost:7204'; // 修改為您的後端 API URL

// 請求攔截器：自動將 JWT Token 附加到每個請求
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // 從 localStorage 中獲取 JWT
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // 將 JWT Token 添加到 Authorization 頭部
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 回應攔截器：處理 401 錯誤，當 token 過期或無效時
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // 當收到 401 Unauthorized 時，清除 token 並重定向到登入頁
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axios;
