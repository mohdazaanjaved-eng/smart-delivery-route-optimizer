package com.smartdelivery.graph;

import com.smartdelivery.entity.Delivery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Coordinates delivery graph creation while keeping graph construction details isolated.
 */
@Service
@RequiredArgsConstructor
public class GraphServiceImpl implements GraphService {

    private final GraphBuilder graphBuilder;

    @Override
    public Graph buildDeliveryGraph(List<Delivery> deliveries) {
        return graphBuilder.buildFromDeliveries(deliveries);
    }
}
