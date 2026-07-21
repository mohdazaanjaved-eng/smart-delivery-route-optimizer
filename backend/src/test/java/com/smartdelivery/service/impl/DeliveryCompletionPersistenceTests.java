package com.smartdelivery.service.impl;

import com.smartdelivery.dto.DeliveryResponse;
import com.smartdelivery.entity.Delivery;
import com.smartdelivery.entity.DeliveryPriority;
import com.smartdelivery.entity.DeliveryStatus;
import com.smartdelivery.exception.DuplicateResourceException;
import com.smartdelivery.exception.ResourceNotFoundException;
import com.smartdelivery.repository.DeliveryRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import javax.sql.DataSource;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
@Import(DeliveryServiceImpl.class)
class DeliveryCompletionPersistenceTests {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private DeliveryServiceImpl deliveryService;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private DataSource dataSource;

    @Test
    void pendingDeliveryRemainsCompletedAfterReload() {
        Delivery pending = deliveryRepository.saveAndFlush(delivery(DeliveryStatus.PENDING));

        DeliveryResponse response = deliveryService.completeDelivery(pending.getId());
        entityManager.clear();
        Delivery reloaded = deliveryRepository.findById(pending.getId()).orElseThrow();

        assertEquals(DeliveryStatus.COMPLETED, response.status());
        assertNotNull(response.completedAt());
        assertEquals(DeliveryStatus.COMPLETED, reloaded.getStatus());
        assertNotNull(reloaded.getCompletedAt());
    }

    @Test
    void pendingDeliveryStartsAndTimestampsPersistAcrossCompletion() {
        Delivery pending = deliveryRepository.saveAndFlush(delivery(DeliveryStatus.PENDING));
        DeliveryResponse started = deliveryService.startDelivery(pending.getId());
        entityManager.clear();
        Delivery reloadedStarted = deliveryRepository.findById(pending.getId()).orElseThrow();
        assertEquals(DeliveryStatus.IN_PROGRESS, started.status());
        assertNotNull(started.startedAt());
        assertEquals(DeliveryStatus.IN_PROGRESS, reloadedStarted.getStatus());
        assertNotNull(reloadedStarted.getStartedAt());

        DeliveryResponse completed = deliveryService.completeDelivery(pending.getId());
        entityManager.clear();
        Delivery reloadedCompleted = deliveryRepository.findById(pending.getId()).orElseThrow();
        assertEquals(DeliveryStatus.COMPLETED, completed.status());
        assertNotNull(reloadedCompleted.getStartedAt());
        assertNotNull(reloadedCompleted.getCompletedAt());
    }

    @Test
    void assignedDeliveryCanStart() {
        Delivery assigned = deliveryRepository.saveAndFlush(delivery(DeliveryStatus.ASSIGNED));
        assertEquals(DeliveryStatus.IN_PROGRESS, deliveryService.startDelivery(assigned.getId()).status());
    }

    @Test
    void invalidStartStatusesReturnConflict() {
        for (DeliveryStatus status : new DeliveryStatus[]{DeliveryStatus.IN_PROGRESS, DeliveryStatus.COMPLETED, DeliveryStatus.DELIVERED}) {
            Delivery existing = deliveryRepository.saveAndFlush(delivery(status));
            assertThrows(DuplicateResourceException.class, () -> deliveryService.startDelivery(existing.getId()));
        }
    }

    @Test
    void missingDeliveryCannotStart() {
        assertThrows(ResourceNotFoundException.class, () -> deliveryService.startDelivery(999998L));
    }

    @Test
    void legacyDeliveredDeliveryReturnsConflict() {
        Delivery delivered = deliveryRepository.saveAndFlush(delivery(DeliveryStatus.DELIVERED));
        assertThrows(DuplicateResourceException.class,
                () -> deliveryService.completeDelivery(delivered.getId()));
    }

    @Test
    void completedDeliveryReturnsConflict() {
        Delivery completed = deliveryRepository.saveAndFlush(delivery(DeliveryStatus.COMPLETED));
        assertThrows(DuplicateResourceException.class,
                () -> deliveryService.completeDelivery(completed.getId()));
    }

    @Test
    void missingDeliveryReturnsNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> deliveryService.completeDelivery(999999L));
    }

    @Test
    void statusColumnIsStringWithCapacityForCompleted() throws Exception {
        try (var connection = dataSource.getConnection()) {
            DatabaseMetaData metadata = connection.getMetaData();
            try (ResultSet columns = metadata.getColumns(null, null, "DELIVERIES", "STATUS")) {
                columns.next();
                assertEquals("CHARACTER VARYING", columns.getString("TYPE_NAME"));
                assertEquals(32, columns.getInt("COLUMN_SIZE"));
            }
        }
    }

    private Delivery delivery(DeliveryStatus status) {
        return Delivery.builder()
                .customerName("Persistence Test")
                .customerPhone("1234567890")
                .customerEmail("persistence@example.com")
                .deliveryAddress("Test address")
                .latitude(12.9716)
                .longitude(77.5946)
                .priority(DeliveryPriority.MEDIUM)
                .status(status)
                .estimatedDeliveryTime(LocalDateTime.now().plusDays(1))
                .build();
    }
}
