package com.smartdelivery.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.ApplicationArguments;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DeliverySchemaMigrationTests {

    @Test
    void addsMissingCompletionColumnAndPreservesExistingEnumValues() {
        @SuppressWarnings("unchecked")
        ObjectProvider<JdbcTemplate> provider = mock(ObjectProvider.class);
        JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
        when(provider.getIfAvailable()).thenReturn(jdbcTemplate);
        when(jdbcTemplate.queryForObject(contains("information_schema.TABLES"), eq(Integer.class)))
                .thenReturn(1);
        when(jdbcTemplate.queryForObject(contains("COLUMN_NAME = 'completed_at'"), eq(Integer.class)))
                .thenReturn(0);
        when(jdbcTemplate.queryForObject(contains("COLUMN_NAME = 'status'"), eq(String.class)))
                .thenReturn("enum('PENDING','ASSIGNED','IN_PROGRESS','DELIVERED')");

        new DeliverySchemaMigration(provider).run(mock(ApplicationArguments.class));

        verify(jdbcTemplate).execute(
                "ALTER TABLE deliveries ADD COLUMN completed_at DATETIME(6) NULL"
        );
        verify(jdbcTemplate).execute(
                "ALTER TABLE deliveries MODIFY COLUMN status "
                        + "enum('PENDING','ASSIGNED','IN_PROGRESS','DELIVERED','COMPLETED') NOT NULL"
        );
    }
}
