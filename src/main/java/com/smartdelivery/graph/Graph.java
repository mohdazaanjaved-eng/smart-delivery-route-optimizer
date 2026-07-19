package com.smartdelivery.graph;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Adjacency-list graph representation for delivery locations.
 * It intentionally contains no route optimization logic yet.
 */
public class Graph {

    private final HashMap<LocationNode, List<Edge>> adjacencyList = new HashMap<>();

    public void addNode(LocationNode node) {
        adjacencyList.putIfAbsent(node, new ArrayList<>());
    }

    public void addEdge(LocationNode source, LocationNode destination, double distance) {
        addNode(source);
        addNode(destination);
        adjacencyList.get(source).add(new Edge(source, destination, distance));
    }

    public List<Edge> getNeighbors(LocationNode node) {
        return Collections.unmodifiableList(adjacencyList.getOrDefault(node, Collections.emptyList()));
    }

    public Set<LocationNode> getNodes() {
        return Collections.unmodifiableSet(adjacencyList.keySet());
    }

    public Map<LocationNode, List<Edge>> getAdjacencyList() {
        return Collections.unmodifiableMap(adjacencyList);
    }
}
