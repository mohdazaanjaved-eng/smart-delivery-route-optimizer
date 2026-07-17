package com.smartdelivery.controller;

import com.smartdelivery.dto.GraphEdgeResponse;
import com.smartdelivery.dto.GraphNodeResponse;
import com.smartdelivery.dto.GraphResponse;
import com.smartdelivery.entity.Delivery;
import com.smartdelivery.graph.Edge;
import com.smartdelivery.graph.Graph;
import com.smartdelivery.graph.GraphService;
import com.smartdelivery.graph.LocationNode;
import com.smartdelivery.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/graph")
@RequiredArgsConstructor
public class GraphController {

    private final DeliveryRepository deliveryRepository;
    private final GraphService graphService;

    @GetMapping
    public ResponseEntity<GraphResponse> getGraph() {
        List<Delivery> deliveries = deliveryRepository.findAll();
        Graph graph = graphService.buildDeliveryGraph(deliveries);

        return ResponseEntity.ok(toResponse(graph));
    }

    private GraphResponse toResponse(Graph graph) {
        List<GraphNodeResponse> nodes = graph.getNodes()
                .stream()
                .sorted(Comparator.comparing(LocationNode::getId, Comparator.nullsLast(Long::compareTo)))
                .map(this::toNodeResponse)
                .toList();

        List<GraphEdgeResponse> edges = graph.getNodes()
                .stream()
                .flatMap(node -> graph.getNeighbors(node).stream())
                .map(this::toEdgeResponse)
                .toList();

        return GraphResponse.builder()
                .nodes(nodes)
                .edges(edges)
                .build();
    }

    private GraphNodeResponse toNodeResponse(LocationNode node) {
        return GraphNodeResponse.builder()
                .id(node.getId())
                .name(node.getName())
                .latitude(node.getLatitude())
                .longitude(node.getLongitude())
                .build();
    }

    private GraphEdgeResponse toEdgeResponse(Edge edge) {
        return GraphEdgeResponse.builder()
                .source(edge.getSource().getName())
                .destination(edge.getDestination().getName())
                .distance(roundToTwoDecimals(edge.getDistance()))
                .build();
    }

    private double roundToTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
