package com.smartdelivery.algorithm;

import com.smartdelivery.graph.Edge;
import com.smartdelivery.graph.Graph;
import com.smartdelivery.graph.LocationNode;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;

/**
 * Implements Dijkstra's shortest path algorithm for weighted delivery graphs.
 */
@Service
public class DijkstraAlgorithm {

    public List<LocationNode> findShortestPath(
            Graph graph,
            LocationNode source,
            LocationNode destination
    ) {
        ShortestPathResult result = execute(graph, source, destination);

        if (Double.isInfinite(result.distances().getOrDefault(destination, Double.POSITIVE_INFINITY))) {
            return Collections.emptyList();
        }

        return reconstructPath(source, destination, result.previousNodes());
    }

    public double calculateShortestDistance(
            Graph graph,
            LocationNode source,
            LocationNode destination
    ) {
        ShortestPathResult result = execute(graph, source, destination);
        return result.distances().getOrDefault(destination, Double.POSITIVE_INFINITY);
    }

    private ShortestPathResult execute(Graph graph, LocationNode source, LocationNode destination) {
        Map<LocationNode, Double> shortestDistances = initializeDistances(graph, source);
        Map<LocationNode, LocationNode> previousNodes = new HashMap<>();
        Set<LocationNode> visitedNodes = new HashSet<>();

        PriorityQueue<LocationNode> priorityQueue = new PriorityQueue<>(
                Comparator.comparingDouble(node -> shortestDistances.getOrDefault(node, Double.POSITIVE_INFINITY))
        );
        priorityQueue.add(source);

        while (!priorityQueue.isEmpty()) {
            LocationNode currentNode = priorityQueue.poll();

            // A node is finalized the first time it is removed with the shortest known distance.
            if (!visitedNodes.add(currentNode)) {
                continue;
            }

            // Stop early once the destination distance is finalized.
            if (currentNode.equals(destination)) {
                break;
            }

            // Relax every outgoing edge and update the queue when a shorter route is found.
            for (Edge edge : graph.getNeighbors(currentNode)) {
                LocationNode neighbor = edge.getDestination();
                if (visitedNodes.contains(neighbor)) {
                    continue;
                }

                double candidateDistance = shortestDistances.get(currentNode) + edge.getDistance();
                if (candidateDistance < shortestDistances.getOrDefault(neighbor, Double.POSITIVE_INFINITY)) {
                    shortestDistances.put(neighbor, candidateDistance);
                    previousNodes.put(neighbor, currentNode);
                    priorityQueue.add(neighbor);
                }
            }
        }

        return new ShortestPathResult(shortestDistances, previousNodes);
    }

    private Map<LocationNode, Double> initializeDistances(Graph graph, LocationNode source) {
        Map<LocationNode, Double> distances = new HashMap<>();

        // All nodes start as unreachable until the algorithm finds a route to them.
        for (LocationNode node : graph.getNodes()) {
            distances.put(node, Double.POSITIVE_INFINITY);
        }

        distances.put(source, 0.0);
        return distances;
    }

    private List<LocationNode> reconstructPath(
            LocationNode source,
            LocationNode destination,
            Map<LocationNode, LocationNode> previousNodes
    ) {
        List<LocationNode> path = new ArrayList<>();
        LocationNode currentNode = destination;

        // Walk backward from destination to source using the predecessor map.
        while (currentNode != null) {
            path.add(currentNode);

            if (currentNode.equals(source)) {
                break;
            }

            currentNode = previousNodes.get(currentNode);
        }

        Collections.reverse(path);
        return path;
    }

    private record ShortestPathResult(
            Map<LocationNode, Double> distances,
            Map<LocationNode, LocationNode> previousNodes
    ) {
    }
}
