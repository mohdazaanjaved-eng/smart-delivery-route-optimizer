package com.smartdelivery.route;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Exposes route optimization endpoints for delivery planning.
 */
@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteOptimizationController {

    private final RouteOptimizationService routeOptimizationService;

    @GetMapping("/optimize")
    public ResponseEntity<RouteResponse> optimizeRoute() {
        return ResponseEntity.ok(routeOptimizationService.optimizePendingDeliveries());
    }
}
