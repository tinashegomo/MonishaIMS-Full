package com.tinasheGomo.MonishaInventoryManagementSystem.dto.measurement;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class MeasurementResponseDTO {

    private UUID measurementId;

    private String measurementName;

    private BigDecimal measurementValue;

    private UUID orderItemId;
}
