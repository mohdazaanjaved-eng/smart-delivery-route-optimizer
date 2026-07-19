package com.smartdelivery.graph;

import com.smartdelivery.entity.Delivery;

import java.util.List;

/**
 * Defines graph creation behavior for future route optimization use cases.
 */
public interface GraphService {

    Graph buildDeliveryGraph(List<Delivery> deliveries);
}
