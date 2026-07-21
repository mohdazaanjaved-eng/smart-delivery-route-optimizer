package com.smartdelivery.config;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SecurityConfigCorsTests {

    @Test
    void allowsConfiguredAndVercelDeploymentOrigins() {
        SecurityConfig securityConfig = new SecurityConfig();
        ReflectionTestUtils.setField(
                securityConfig,
                "frontendUrl",
                "https://delivery.example.com/, https://presentation.example.com"
        );

        UrlBasedCorsConfigurationSource source =
                (UrlBasedCorsConfigurationSource) securityConfig.corsConfigurationSource();
        CorsConfiguration configuration = source.getCorsConfigurations().get("/**");

        assertEquals(
                "https://smart-delivery-git-main-project.vercel.app",
                configuration.checkOrigin("https://smart-delivery-git-main-project.vercel.app")
        );
        assertEquals(
                "https://delivery.example.com",
                configuration.checkOrigin("https://delivery.example.com")
        );
        assertTrue(configuration.getAllowCredentials());
    }
}
