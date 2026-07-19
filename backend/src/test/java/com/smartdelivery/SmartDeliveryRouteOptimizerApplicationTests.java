package com.smartdelivery;

import com.smartdelivery.repository.UserRepository;
import com.smartdelivery.repository.DeliveryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(properties = {
        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,"
                + "org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration"
})
class SmartDeliveryRouteOptimizerApplicationTests {

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private DeliveryRepository deliveryRepository;

    @Test
    void contextLoads() {
    }
}
