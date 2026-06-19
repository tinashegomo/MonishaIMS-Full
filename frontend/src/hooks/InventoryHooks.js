import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as inventoryAPI from "@/api/InventoryAPI";

/* AUTH HOOKS */

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (UserRequestDTO) => inventoryAPI.registerUser(UserRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (AuthRequestDTO) => inventoryAPI.loginUser(AuthRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

/* USER HOOKS */

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => inventoryAPI.getCurrentUser(),
    retry: false, // don't retry on 401 — token is expired or missing
  });
};

export const useGetCurrentUserRole = () => {
  return useQuery({
    queryKey: ["currentUserRole"],
    queryFn: () => inventoryAPI.getCurrentUserRole(),
    retry: false,
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => inventoryAPI.getAllUsers(),
  });
};

export const useGetUserById = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => inventoryAPI.getUserById(id),
    enabled: !!id, // only run when id is available (not null/undefined/"")
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userRole }) => inventoryAPI.updateUserRole(id, userRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["currentUserRole"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => inventoryAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

/* SCHOOL HOOKS */

export const useGetAllSchools = () => {
  return useQuery({
    queryKey: ["schools"],
    queryFn: () => inventoryAPI.getAllSchools(),
  });
};

export const useGetSchoolById = (schoolId) => {
  return useQuery({
    queryKey: ["school", schoolId],
    queryFn: () => inventoryAPI.getSchoolById(schoolId),
    enabled: !!schoolId,
  });
};

export const useCreateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (SchoolRequestDTO) => inventoryAPI.createSchool(SchoolRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, SchoolRequestDTO }) => inventoryAPI.updateSchool(schoolId, SchoolRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schoolId) => inventoryAPI.deleteSchool(schoolId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

/* CUSTOMER HOOKS */

export const useGetAllCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => inventoryAPI.getAllCustomers(),
  });
};

export const useGetCustomerById = (customerId) => {
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => inventoryAPI.getCustomerById(customerId),
    enabled: !!customerId,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (CustomerRequestDTO) => inventoryAPI.createCustomer(CustomerRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, CustomerRequestDTO }) => inventoryAPI.updateCustomer(customerId, CustomerRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId) => inventoryAPI.deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

/* WAREHOUSE HOOKS */

export const useGetAllWarehouseBatches = () => {
  return useQuery({
    queryKey: ["warehouseBatches"],
    queryFn: () => inventoryAPI.getAllWarehouseBatches(),
  });
};

export const useGetWarehouseBatchById = (batchId) => {
  return useQuery({
    queryKey: ["warehouseBatch", batchId],
    queryFn: () => inventoryAPI.getWarehouseBatchById(batchId),
    enabled: !!batchId,
  });
};

export const useCreateWarehouseBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (WarehouseBatchRequestDTO) => inventoryAPI.createWarehouseBatch(WarehouseBatchRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouseBatches"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteWarehouseBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batchId) => inventoryAPI.deleteWarehouseBatch(batchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouseBatches"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useAddSizesToBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchId, sizes }) => inventoryAPI.addSizesToBatch({ batchId, sizes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouseBatches"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

/* PRODUCT HOOKS */

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => inventoryAPI.getAllProducts(),
  });
};

export const useGetProductById = (productId) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => inventoryAPI.getProductById(productId),
    enabled: !!productId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ProductRequestDTO) => inventoryAPI.createProduct(ProductRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["warehouseBatches"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => inventoryAPI.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

/* ORDER HOOKS */

export const useGetAllOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => inventoryAPI.getAllOrders(),
  });
};

export const useGetOrderById = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => inventoryAPI.getOrderById(orderId),
    enabled: !!orderId,
  });
};

/*
 * useGetOrdersByStatus — filtered read, use useQuery.
 *
 * Usage:
 *   const { data } = useGetOrdersByStatus("PENDING");
 *   const { data } = useGetOrdersByStatus("IN_PRODUCTION");
 *   const { data } = useGetOrdersByStatus("READY_FOR_COLLECTION");
 *
 * Why put status in queryKey?
 *   queryKey: ["orders", "status", status]
 *
 *   Each status gets its OWN cache slot.
 *   "PENDING" ≠ "IN_PRODUCTION" — results are cached separately.
 *   Switching between statuses serves from cache instantly on revisit.
 *
 * @param {string} status - the OrderStatus enum value from the backend
 */
export const useGetOrdersByStatus = (status) => {
  return useQuery({
    queryKey: ["orders", "status", status],
    queryFn: () => inventoryAPI.getOrdersByStatus(status),
    enabled: !!status,
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (OrderRequestDTO) => inventoryAPI.createOrder(OrderRequestDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) => inventoryAPI.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ newPassword }) => inventoryAPI.changePassword(newPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => inventoryAPI.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useGetUserActivity = (id) => {
  return useQuery({
    queryKey: ["userActivity", id],
    queryFn: () => inventoryAPI.getUserActivity(id),
    enabled: !!id,
  });
};