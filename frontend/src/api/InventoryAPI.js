import axios from "axios";
import { getStoredToken, isTokenExpired, removeToken } from "../utils/tokenUtils";


const API = axios.create({
    baseURL: "/api/monishaInventory"
});

// Before EVERY request is sent, this function runs.
// It reads the JWT token from localStorage and attaches it to the Authorization header.
// Spring Boot's security filter reads this header and decides whether to let the request through.
// If there's no token (user not logged in), the header is simply left out
API.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    // If the token is expired, remove it from localStorage
    if (isTokenExpired(token)) {
      removeToken();
      return config; // proceeds without auth header → backend returns 401
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//This is a response interceptor — the mirror image of the request interceptor. It catches every response (or error) coming back from the backend.
//Response interceptor: auto-redirect to /login on 401/403
API.interceptors.response.use(
  (response) => response,   // Handler #1: runs on SUCCESS
  (error) => {              // Handler #2: runs on FAILURE
    if (error.response?.status === 401 || error.response?.status === 403) {
      removeToken();
      window.location.href = "/login";
    }

    // If we don't throw the error here, Axios will think the request worked fine, even though it actually failed.
    // That means the component that called this API will not know there was a problem, and it may try to use data that doesn't exist and crash.
    throw error; // send the error back so the calling code still knows it failed
  }
);    

/*REGISTER AND LOGIN APIs*/

export const registerUser = async (UserRequestDTO) => {
    const response = await API.post("/auth/register", UserRequestDTO);
    return response.data; // Returns AuthResponseDTO
};

export const loginUser = async (AuthRequestDTO) => {
    const response = await API.post("/auth/login", AuthRequestDTO);
    return response.data; // Returns AuthResponseDTO
};

/*USER APIs */

export const updateUserRole = async (id, userRole) => {
  const response = await API.patch(`/user/update-user-role/${id}`, null, { params: { userRole: userRole }});
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await API.get("/user/get-current-user");
  return response.data;
};

export const getCurrentUserRole = async () => {
  const response = await API.get("/user/get-current-user-role");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await API.get("/user/get-all-users");
  return response.data;
};  

export const getUserById = async (id) => {
  const response = await API.get(`/user/get-user-byId/${id}`);
  return response.data;
};  

export const updateUser = async (id, UserRequestDTO) => {
  const response = await API.patch(`/user/update-user/${id}`, UserRequestDTO);
  return response.data;
};

export const changePassword = async (newPassword) => {
  const response = await API.patch(`/user/change-password`, null, {params: { newPassword:newPassword }});
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await API.delete(`/user/delete-user/${id}`);
  return response.data;
};

export const getUserActivity = async (id) => {
  const response = await API.get(`/user/get-user-activity/${id}`);
  return response.data;
};  

/* SCHOOL APIs */

export const createSchool = async (SchoolRequestDTO) => {
  const response = await API.post(`/school/create-school`, SchoolRequestDTO);
  return response.data;
};
 
export const getAllSchools = async () => {
  const response = await API.get(`/school/get-all-schools`);
  return response.data;
};
 
export const getSchoolById = async (schoolId) => {
  const response = await API.get(`/school/get-school-byId/${schoolId}`);
  return response.data;
};
 
export const updateSchool = async (schoolId, SchoolRequestDTO) => {
  const response = await API.put(`/school/update-school/${schoolId}`, SchoolRequestDTO);
  return response.data;
};
 
export const deleteSchool = async (schoolId) => {
  const response = await API.delete(`/school/delete-school/${schoolId}`);
  return response.data;
};
/* CUSTOMER APIs */

export const createCustomer = async (CustomerRequestDTO) => {
  const response = await API.post(`/customer/create-customer`, CustomerRequestDTO);
  return response.data;
};

export const getAllCustomers = async () => {
  const response = await API.get(`/customer/get-all-customers`);
  return response.data;
};

export const getCustomerById = async (customerId) => {
  const response = await API.get(`/customer/get-customer-byId/${customerId}`);
  return response.data;
};

export const updateCustomer = async (customerId, CustomerRequestDTO) => {
  const response = await API.put(`/customer/update-customer/${customerId}`, CustomerRequestDTO);
  return response.data;
};

export const deleteCustomer = async (customerId) => {
  const response = await API.delete(`/customer/delete-customer/${customerId}`);
  return response.data;
};

/* WAREHOUSE APIs */

export const createWarehouseBatch = async (WarehouseBatchRequestDTO) => {
  const response = await API.post(`/warehouse/create-batch`, WarehouseBatchRequestDTO);
  return response.data;
};

export const getAllWarehouseBatches = async () => {
  const response = await API.get(`/warehouse/get-all-batches`);
  return response.data;
};

export const getWarehouseBatchById = async (batchId) => {
  const response = await API.get(`/warehouse/get-batch-byId/${batchId}`);
  return response.data;
};

export const deleteWarehouseBatch = async (batchId) => {
  const response = await API.delete(`/warehouse/delete-batch/${batchId}`);
  return response.data;
};

export const addSizesToBatch = async (batchId, sizes) => {
  const response = await API.post(`/warehouse/add-sizes-to-batch/${batchId}`, sizes);
  return response.data;
};

export const restockBatch = async (batchId, items) => {
  const response = await API.post(`/warehouse/restock-batch/${batchId}`, items);
  return response.data;
};

export const getRestockHistory = async (batchId) => {
  const response = await API.get(`/warehouse/restock-history/${batchId}`);
  return response.data;
};

export const getDepletedHistory = async (batchId) => {
  const response = await API.get(`/warehouse/depleted-history/${batchId}`);
  return response.data;
};

/* PRODUCT APIs */

export const createProduct = async (ProductRequestDTO) => {
  const response = await API.post(`/product/create-product`, ProductRequestDTO);
  return response.data;
};

export const getAllProducts = async () => {
  const response = await API.get(`/product/get-all-products`);
  return response.data;
};

export const getProductById = async (productId) => {
  const response = await API.get(`/product/get-product-byId/${productId}`);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await API.delete(`/product/delete-product/${productId}`);
  return response.data;
};

export const restockProduct = async (productId, items) => {
  const response = await API.post(`/product/restock-product/${productId}`, items);
  return response.data;
};

export const getProductRestockHistory = async (productId) => {
  const response = await API.get(`/product/restock-history/${productId}`);
  return response.data;
};

export const getProductDepletedHistory = async (productId) => {
  const response = await API.get(`/product/depleted-history/${productId}`);
  return response.data;
};

/* ORDER APIs */

export const createOrder = async (OrderRequestDTO) => {
  const response = await API.post(`order/create-order`, OrderRequestDTO);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await API.get(`order/get-all-orders`);
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await API.get(`/order/get-order-byId/${orderId}`);
  return response.data;
};

export const getOrdersByStatus = async (status) => {
  const response = await API.get(`/order/get-order-byStatus/${status}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await API.patch(`/order/update-order-status/${orderId}`, null, { params: { status:status } });
  return response.data;
};

/* ADMIN APIs */

export const resetDatabase = async () => {
  const response = await API.delete("/admin/reset-database");
  return response.data;
};

export const getResetAuditLog = async () => {
  const response = await API.get("/admin/reset-audit-log");
  return response.data;
};
