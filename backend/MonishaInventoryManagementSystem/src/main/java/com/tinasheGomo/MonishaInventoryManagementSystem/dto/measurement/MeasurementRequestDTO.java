package com.tinasheGomo.MonishaInventoryManagementSystem.dto.measurement;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class MeasurementRequestDTO {

   private String measurementName;
   private BigDecimal measurementValue;
}
