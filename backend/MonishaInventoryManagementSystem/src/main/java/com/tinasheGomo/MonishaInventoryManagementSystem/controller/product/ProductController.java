package com.tinasheGomo.MonishaInventoryManagementSystem.controller.product;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.request.ProductRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.response.ProductResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.shared.SizeQuantityDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductRestockHistoryEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.product.ProductDepletedHistoryEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.product.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/monishaInventory/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PostMapping("/create-product")
    public ProductResponseDTO createProduct(@RequestBody @Valid ProductRequestDTO requestDTO) {
        return productService.createProduct(requestDTO);
    }

    @GetMapping("/get-all-products")
    public List<ProductResponseDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/get-product-byId/{productId}")
    public ProductResponseDTO getProductById(@PathVariable UUID productId) {
        return productService.getProductById(productId);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @DeleteMapping("/delete-product/{productId}")
    public void deleteProduct(@PathVariable UUID productId) {
        productService.deleteProduct(productId);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PostMapping("/restock-product/{productId}")
    public ProductResponseDTO restockProduct(
            @PathVariable UUID productId,
            @RequestBody @Valid List<SizeQuantityDTO> restockItems) {
        return productService.restockProduct(productId, restockItems);
    }

    @GetMapping("/restock-history/{productId}")
    public List<ProductRestockHistoryEntity> getRestockHistory(@PathVariable UUID productId) {
        return productService.getRestockHistory(productId);
    }

    @GetMapping("/depleted-history/{productId}")
    public List<ProductDepletedHistoryEntity> getDepletedHistory(@PathVariable UUID productId) {
        return productService.getDepletedHistory(productId);
    }
}
