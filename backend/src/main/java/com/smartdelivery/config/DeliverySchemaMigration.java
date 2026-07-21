package com.smartdelivery.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeliverySchemaMigration implements ApplicationRunner {

    private static final String STATUS_COLUMN_TYPE =
            "enum('ASSIGNED','DELIVERED','IN_PROGRESS','PENDING','COMPLETED')";

    private final ObjectProvider<JdbcTemplate> jdbcTemplateProvider;

    @Override
    public void run(ApplicationArguments arguments) {
        JdbcTemplate jdbcTemplate = jdbcTemplateProvider.getIfAvailable();
        if (jdbcTemplate == null || !deliveryTableExists(jdbcTemplate)) {
            return;
        }

        ensureCompletedAtColumn(jdbcTemplate);
        ensureCompletedStatusValue(jdbcTemplate);
    }

    private boolean deliveryTableExists(JdbcTemplate jdbcTemplate) {
        Integer count = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM information_schema.TABLES
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'deliveries'
                """,
                Integer.class
        );
        return count != null && count > 0;
    }

    private void ensureCompletedAtColumn(JdbcTemplate jdbcTemplate) {
        Integer count = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'deliveries'
                  AND COLUMN_NAME = 'completed_at'
                """,
                Integer.class
        );

        if (count != null && count == 0) {
            log.warn("Adding missing deliveries.completed_at column");
            jdbcTemplate.execute("ALTER TABLE deliveries ADD COLUMN completed_at DATETIME(6) NULL");
        }
    }

    private void ensureCompletedStatusValue(JdbcTemplate jdbcTemplate) {
        String columnType = jdbcTemplate.queryForObject(
                """
                SELECT COLUMN_TYPE
                FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'deliveries'
                  AND COLUMN_NAME = 'status'
                """,
                String.class
        );

        if (columnType == null
                || !columnType.toLowerCase(Locale.ROOT).startsWith("enum(")
                || columnType.toUpperCase(Locale.ROOT).contains("'COMPLETED'")) {
            return;
        }

        log.warn("Upgrading deliveries.status to include COMPLETED");
        jdbcTemplate.execute(
                "ALTER TABLE deliveries MODIFY COLUMN status " + STATUS_COLUMN_TYPE + " NOT NULL"
        );
    }
}
