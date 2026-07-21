package com.smartdelivery.service.impl;

import com.smartdelivery.dto.CreateDeliveryRequest;
import com.smartdelivery.dto.DeliveryResponse;
import com.smartdelivery.dto.UpdateDeliveryRequest;
import com.smartdelivery.entity.Delivery;
import com.smartdelivery.entity.DeliveryStatus;
import com.smartdelivery.exception.DuplicateResourceException;
import com.smartdelivery.exception.ResourceNotFoundException;
import com.smartdelivery.repository.DeliveryRepository;
import com.smartdelivery.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository deliveryRepository;

    @Override
    @Transactional
    public DeliveryResponse createDelivery(CreateDeliveryRequest request) {
        Delivery delivery = Delivery.builder()
                .customerName(request.customerName().trim())
                .customerPhone(request.customerPhone().trim())
                .customerEmail(request.customerEmail().trim().toLowerCase())
                .deliveryAddress(request.deliveryAddress().trim())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .priority(request.priority())
                .status(request.status() == null ? DeliveryStatus.PENDING : request.status())
                .estimatedDeliveryTime(request.estimatedDeliveryTime())
                .build();

        return toResponse(deliveryRepository.save(delivery));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryResponse> getAllDeliveries() {
        return deliveryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DeliveryResponse getDeliveryById(Long id) {
        return toResponse(findDeliveryById(id));
    }

    @Override
    @Transactional
    public DeliveryResponse updateDelivery(Long id, UpdateDeliveryRequest request) {
        Delivery delivery = findDeliveryById(id);

        delivery.setCustomerName(request.customerName().trim());
        delivery.setCustomerPhone(request.customerPhone().trim());
        delivery.setCustomerEmail(request.customerEmail().trim().toLowerCase());
        delivery.setDeliveryAddress(request.deliveryAddress().trim());
        delivery.setLatitude(request.latitude());
        delivery.setLongitude(request.longitude());
        delivery.setPriority(request.priority());
        delivery.setStatus(request.status());
        delivery.setEstimatedDeliveryTime(request.estimatedDeliveryTime());

        return toResponse(deliveryRepository.save(delivery));
    }

    @Override
    @Transactional
    public DeliveryResponse completeDelivery(Long id) {
        log.info("Completing delivery id={}", id);

        try {
            Delivery delivery = findDeliveryById(id);
            log.info("Delivery id={} currentStatus={}", id, delivery.getStatus());

            if (delivery.getStatus() == DeliveryStatus.COMPLETED
                    || delivery.getStatus() == DeliveryStatus.DELIVERED) {
                throw new DuplicateResourceException("Delivery is already completed");
            }

            delivery.setStatus(DeliveryStatus.COMPLETED);
            delivery.setCompletedAt(LocalDateTime.now());

            log.info("Saving completed delivery id={}", id);
            Delivery savedDelivery = deliveryRepository.saveAndFlush(delivery);
            log.info("Completed delivery saved id={} status={} completedAt={}",
                    id,
                    savedDelivery.getStatus(),
                    savedDelivery.getCompletedAt());
            return toResponse(savedDelivery);
        } catch (Exception exception) {
            log.error("Failed to complete delivery id={}", id, exception);
            throw exception;
        }
    }

    @Override
    @Transactional
    public void deleteDelivery(Long id) {
        Delivery delivery = findDeliveryById(id);
        deliveryRepository.delete(delivery);
    }

    private Delivery findDeliveryById(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + id));
    }

    private DeliveryResponse toResponse(Delivery delivery) {
        return DeliveryResponse.builder()
                .id(delivery.getId())
                .customerName(delivery.getCustomerName())
                .customerPhone(delivery.getCustomerPhone())
                .customerEmail(delivery.getCustomerEmail())
                .deliveryAddress(delivery.getDeliveryAddress())
                .latitude(delivery.getLatitude())
                .longitude(delivery.getLongitude())
                .priority(delivery.getPriority())
                .status(delivery.getStatus())
                .estimatedDeliveryTime(delivery.getEstimatedDeliveryTime())
                .createdAt(delivery.getCreatedAt())
                .updatedAt(delivery.getUpdatedAt())
                .completedAt(delivery.getCompletedAt())
                .build();
    }
}
