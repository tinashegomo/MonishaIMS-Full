package com.tinasheGomo.MonishaInventoryManagementSystem.service.measurement;

import com.tinasheGomo.MonishaInventoryManagementSystem.dto.measurement.MeasurementRequestDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.dto.measurement.MeasurementResponseDTO;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.measurement.MeasurementEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.entity.order.OrderItemEntity;
import com.tinasheGomo.MonishaInventoryManagementSystem.exception.exceptions.NotFoundException;
import com.tinasheGomo.MonishaInventoryManagementSystem.mapper.measurement.MeasurementMapper;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.measurement.MeasurementRepository;
import com.tinasheGomo.MonishaInventoryManagementSystem.repository.order.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MeasurementService {

    private final MeasurementRepository measurementRepository;
    private final OrderItemRepository orderItemRepository;
    private final MeasurementMapper measurementMapper;

    /**
     * GET ALL MEASUREMENTS FOR AN ORDER ITEM
     * Used by OrderItemService when a tailoring screen needs measurements for a specific item
     */
    @Transactional(readOnly = true)
    public List<MeasurementResponseDTO> getMeasurementsByOrderItem(UUID orderItemId) {

        OrderItemEntity orderItem = orderItemRepository.findByOrderItemId(orderItemId)
                .orElseThrow(() -> new NotFoundException("Order item not found"));

        return measurementMapper.toResponseList(orderItem.getMeasurements());
    }

    /**
     INTERNAL HELPER (used by OrderItemService)
     Used by OrderItemService during order creation
     */
    @Transactional
    public List<MeasurementEntity> createMeasurements(OrderItemEntity orderItem, List<MeasurementRequestDTO> dtos) {

        List<MeasurementEntity> measurements = new ArrayList<>();

        for (MeasurementRequestDTO dto : dtos) {
            MeasurementEntity measurement = measurementMapper.toEntity(dto);
            measurement.setOrderItem(orderItem);
            measurements.add(measurement);
        }

        return measurementRepository.saveAll(measurements);
    }
}
