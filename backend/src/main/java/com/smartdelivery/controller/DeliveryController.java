package com.smartdelivery.controller;

import com.smartdelivery.dto.CreateDeliveryRequest;
import com.smartdelivery.dto.DeliveryResponse;
import com.smartdelivery.dto.UpdateDeliveryRequest;
import com.smartdelivery.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping
    public ResponseEntity<DeliveryResponse> createDelivery(@Valid @RequestBody CreateDeliveryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(deliveryService.createDelivery(request));
    }

    @GetMapping
    public ResponseEntity<List<DeliveryResponse>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryResponse> getDeliveryById(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.getDeliveryById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeliveryResponse> updateDelivery(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDeliveryRequest request
    ) {
        return ResponseEntity.ok(deliveryService.updateDelivery(id, request));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<DeliveryResponse> completeDelivery(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.completeDelivery(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id) {
        deliveryService.deleteDelivery(id);
        return ResponseEntity.noContent().build();
    }
}
