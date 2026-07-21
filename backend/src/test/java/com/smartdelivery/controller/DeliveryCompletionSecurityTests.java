package com.smartdelivery.controller;

import com.smartdelivery.config.SecurityConfig;
import com.smartdelivery.dto.DeliveryResponse;
import com.smartdelivery.entity.DeliveryStatus;
import com.smartdelivery.service.DeliveryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DeliveryController.class)
@Import(SecurityConfig.class)
class DeliveryCompletionSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DeliveryService deliveryService;

    @Test
    @WithMockUser
    void authenticatedPatchAccessSucceeds() throws Exception {
        when(deliveryService.completeDelivery(1L)).thenReturn(
                DeliveryResponse.builder().id(1L).status(DeliveryStatus.COMPLETED).build()
        );

        mockMvc.perform(patch("/api/deliveries/1/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }
}
