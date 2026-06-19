package com.tinasheGomo.MonishaInventoryManagementSystem.controller.product;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.request.ProductRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.product.response.ProductResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.service.product.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/monishaInventory/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

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

    @DeleteMapping("/delete-product/{productId}")
    public void deleteProduct(@PathVariable UUID productId) {
        productService.deleteProduct(productId);
    }
}
