package com.smartdelivery.service.impl;

import com.smartdelivery.dto.DeliveryResponse;
import com.smartdelivery.entity.Delivery;
import com.smartdelivery.entity.DeliveryStatus;
import com.smartdelivery.exception.DuplicateResourceException;
import com.smartdelivery.repository.DeliveryRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DeliveryServiceImplCompletionTests {

    private final DeliveryRepository deliveryRepository = mock(DeliveryRepository.class);
    private final DeliveryServiceImpl deliveryService = new DeliveryServiceImpl(deliveryRepository);

    @Test
    void marksPendingDeliveryAsCompleted() {
        Delivery delivery = Delivery.builder().id(1L).status(DeliveryStatus.PENDING).build();
        when(deliveryRepository.findById(1L)).thenReturn(Optional.of(delivery));
        when(deliveryRepository.save(delivery)).thenReturn(delivery);

        DeliveryResponse response = deliveryService.completeDelivery(1L);

        assertEquals(DeliveryStatus.COMPLETED, response.status());
        assertNotNull(response.completedAt());
        verify(deliveryRepository).save(delivery);
    }

    @Test
    void rejectsAlreadyCompletedDelivery() {
        Delivery delivery = Delivery.builder().id(2L).status(DeliveryStatus.COMPLETED).build();
        when(deliveryRepository.findById(2L)).thenReturn(Optional.of(delivery));

        assertThrows(DuplicateResourceException.class, () -> deliveryService.completeDelivery(2L));
        verify(deliveryRepository, never()).save(delivery);
    }
}
