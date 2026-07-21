package com.smartdelivery.service;

import com.smartdelivery.dto.CreateDeliveryRequest;
import com.smartdelivery.dto.DeliveryResponse;
import com.smartdelivery.dto.UpdateDeliveryRequest;

import java.util.List;

public interface DeliveryService {

    DeliveryResponse createDelivery(CreateDeliveryRequest request);

    List<DeliveryResponse> getAllDeliveries();

    DeliveryResponse getDeliveryById(Long id);

    DeliveryResponse updateDelivery(Long id, UpdateDeliveryRequest request);

    DeliveryResponse completeDelivery(Long id);

    void deleteDelivery(Long id);
}
