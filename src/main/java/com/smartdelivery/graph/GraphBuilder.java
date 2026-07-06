package com.smartdelivery.graph;

import com.smartdelivery.entity.Delivery;
import com.smartdelivery.util.DistanceCalculator;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Builds graph structures from delivery records.
 * Each delivery is converted to one node and connected to every other delivery node.
 */
@Service
public class GraphBuilder {

    public Graph buildFromDeliveries(List<Delivery> deliveries) {
        Graph graph = new Graph();

        List<LocationNode> nodes = deliveries.stream()
                .map(this::toLocationNode)
                .toList();

        nodes.forEach(graph::addNode);
        connectAllNodes(graph, nodes);

        return graph;
    }

    private void connectAllNodes(Graph graph, List<LocationNode> nodes) {
        for (int sourceIndex = 0; sourceIndex < nodes.size(); sourceIndex++) {
            for (int destinationIndex = sourceIndex + 1; destinationIndex < nodes.size(); destinationIndex++) {
                LocationNode source = nodes.get(sourceIndex);
                LocationNode destination = nodes.get(destinationIndex);
                double distance = DistanceCalculator.calculateDistance(
                        source.getLatitude(),
                        source.getLongitude(),
                        destination.getLatitude(),
                        destination.getLongitude()
                );

                graph.addEdge(source, destination, distance);
                graph.addEdge(destination, source, distance);
            }
        }
    }

    private LocationNode toLocationNode(Delivery delivery) {
        return new LocationNode(
                delivery.getId(),
                delivery.getCustomerName(),
                delivery.getLatitude(),
                delivery.getLongitude()
        );
    }
}
