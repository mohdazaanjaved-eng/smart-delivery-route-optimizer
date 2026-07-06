package com.smartdelivery.route;

import com.smartdelivery.algorithm.DijkstraAlgorithm;
import com.smartdelivery.entity.Delivery;
import com.smartdelivery.entity.DeliveryStatus;
import com.smartdelivery.graph.Graph;
import com.smartdelivery.graph.GraphService;
import com.smartdelivery.graph.LocationNode;
import com.smartdelivery.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Builds an optimized delivery visit order using the existing graph and Dijkstra algorithm.
 */
@Service
@RequiredArgsConstructor
public class RouteOptimizationServiceImpl implements RouteOptimizationService {

    private final DeliveryRepository deliveryRepository;
    private final GraphService graphService;
    private final DijkstraAlgorithm dijkstraAlgorithm;

    @Override
    @Transactional(readOnly = true)
    public RouteResponse optimizePendingDeliveries() {
        List<Delivery> pendingDeliveries = getPendingDeliveries();

        if (pendingDeliveries.isEmpty()) {
            return RouteResponse.builder()
                    .totalDistance(0.0)
                    .totalStops(0)
                    .route(List.of())
                    .build();
        }

        Graph graph = graphService.buildDeliveryGraph(pendingDeliveries);
        Map<Long, LocationNode> nodesByDeliveryId = graph.getNodes()
                .stream()
                .collect(Collectors.toMap(LocationNode::getId, Function.identity()));

        return buildOptimizedRoute(pendingDeliveries, graph, nodesByDeliveryId);
    }

    private List<Delivery> getPendingDeliveries() {
        return deliveryRepository.findAll()
                .stream()
                .filter(delivery -> delivery.getStatus() == DeliveryStatus.PENDING)
                .sorted(Comparator.comparing(Delivery::getId, Comparator.nullsLast(Long::compareTo)))
                .toList();
    }

    private RouteResponse buildOptimizedRoute(
            List<Delivery> pendingDeliveries,
            Graph graph,
            Map<Long, LocationNode> nodesByDeliveryId
    ) {
        List<RouteStepResponse> routeSteps = new ArrayList<>();
        Set<Long> visitedDeliveryIds = new HashSet<>();

        Delivery currentDelivery = pendingDeliveries.getFirst();
        double totalDistance = 0.0;

        routeSteps.add(toRouteStep(1, currentDelivery, 0.0));
        visitedDeliveryIds.add(currentDelivery.getId());

        while (visitedDeliveryIds.size() < pendingDeliveries.size()) {
            LocationNode currentNode = nodesByDeliveryId.get(currentDelivery.getId());
            Optional<NextStop> nextStop = findNearestUnvisitedDelivery(
                    pendingDeliveries,
                    visitedDeliveryIds,
                    graph,
                    currentNode,
                    nodesByDeliveryId
            );

            if (nextStop.isEmpty()) {
                break;
            }

            NextStop selectedStop = nextStop.get();
            totalDistance += selectedStop.distance();
            currentDelivery = selectedStop.delivery();
            visitedDeliveryIds.add(currentDelivery.getId());
            routeSteps.add(toRouteStep(routeSteps.size() + 1, currentDelivery, selectedStop.distance()));
        }

        return RouteResponse.builder()
                .totalDistance(roundToTwoDecimals(totalDistance))
                .totalStops(routeSteps.size())
                .route(routeSteps)
                .build();
    }

    private Optional<NextStop> findNearestUnvisitedDelivery(
            List<Delivery> pendingDeliveries,
            Set<Long> visitedDeliveryIds,
            Graph graph,
            LocationNode currentNode,
            Map<Long, LocationNode> nodesByDeliveryId
    ) {
        NextStop nearestStop = null;

        // Evaluate each unvisited delivery and pick the closest Dijkstra distance.
        for (Delivery candidateDelivery : pendingDeliveries) {
            if (visitedDeliveryIds.contains(candidateDelivery.getId())) {
                continue;
            }

            LocationNode candidateNode = nodesByDeliveryId.get(candidateDelivery.getId());
            double distance = dijkstraAlgorithm.calculateShortestDistance(graph, currentNode, candidateNode);

            if (Double.isInfinite(distance)) {
                continue;
            }

            if (nearestStop == null || distance < nearestStop.distance()) {
                nearestStop = new NextStop(candidateDelivery, distance);
            }
        }

        return Optional.ofNullable(nearestStop);
    }

    private RouteStepResponse toRouteStep(int order, Delivery delivery, double distanceFromPrevious) {
        return RouteStepResponse.builder()
                .order(order)
                .customer(delivery.getCustomerName())
                .address(delivery.getDeliveryAddress())
                .latitude(delivery.getLatitude())
                .longitude(delivery.getLongitude())
                .distanceFromPrevious(roundToTwoDecimals(distanceFromPrevious))
                .build();
    }

    private double roundToTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private record NextStop(Delivery delivery, double distance) {
    }
}
