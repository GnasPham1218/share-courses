    import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Bạn có thể thêm Interceptors để xử lý lỗi 401, 403 tập trung
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) alert("Bạn không có quyền thực hiện thao tác này");
    return Promise.reject(error);
  }
);

export default apiClient;