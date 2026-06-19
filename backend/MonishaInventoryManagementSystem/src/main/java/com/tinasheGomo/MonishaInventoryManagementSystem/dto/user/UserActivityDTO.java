package com.tinasheGomo.MonishaInventoryManagementSystem.dto.user;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.order.response.OrderResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.response.ProductResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.warehouse.response.WarehouseBatchResponseDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserActivityDTO {

    private UserResponseDTO user;
    private long totalOrdersCreated;
    private long totalProductsCreated;
    private long totalBatchesCreated;
    private List<OrderResponseDTO> recentOrders;
    private List<ProductResponseDTO> recentProducts;
    private List<WarehouseBatchResponseDTO> recentBatches;
}
