package com.tinasheGomo.MonishaInventoryManagementSystem.repository.measurement;

import com.tinasheGomo.MonishaInventoryManagementSystem.entity.measurement.MeasurementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MeasurementRepository extends JpaRepository<MeasurementEntity, UUID> {

    Optional<MeasurementEntity> findByMeasurementId(UUID measurementId);
}