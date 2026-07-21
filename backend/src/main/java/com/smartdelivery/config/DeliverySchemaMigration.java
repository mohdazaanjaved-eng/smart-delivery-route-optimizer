package com.smartdelivery.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Locale;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeliverySchemaMigration implements ApplicationRunner {

    static final String STATUS_MIGRATION_SQL =
            "ALTER TABLE deliveries MODIFY COLUMN status VARCHAR(32) NOT NULL";
    static final String COMPLETED_AT_MIGRATION_SQL =
            "ALTER TABLE deliveries ADD COLUMN completed_at DATETIME(6) NULL";

    private final ObjectProvider<JdbcTemplate> jdbcTemplateProvider;

    @Override
    public void run(ApplicationArguments arguments) {
        JdbcTemplate jdbcTemplate = jdbcTemplateProvider.getIfAvailable();
        if (jdbcTemplate == null || !isMySql(jdbcTemplate)) {
            return;
        }

        try {
            if (!deliveryTableExists(jdbcTemplate)) {
                log.info("Skipping delivery schema migration because deliveries table does not exist");
                return;
            }

            ensureCompletedAtColumn(jdbcTemplate);
            ensureVarcharStatusColumn(jdbcTemplate);
        } catch (RuntimeException exception) {
            log.error("Delivery schema migration failed; application startup cannot continue", exception);
            throw exception;
        }
    }

    private boolean isMySql(JdbcTemplate jdbcTemplate) {
        DataSource dataSource = jdbcTemplate.getDataSource();
        if (dataSource == null) {
            log.info("Skipping delivery schema migration because no datasource is available");
            return false;
        }

        try (Connection connection = dataSource.getConnection()) {
            String databaseProduct = connection.getMetaData().getDatabaseProductName();
            boolean mySql = databaseProduct != null
                    && databaseProduct.toLowerCase(Locale.ROOT).contains("mysql");
            if (!mySql) {
                log.info("Skipping MySQL delivery schema migration for database product={}", databaseProduct);
            }
            return mySql;
        } catch (SQLException exception) {
            throw new IllegalStateException("Unable to identify database before delivery schema migration", exception);
        }
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
            jdbcTemplate.execute(COMPLETED_AT_MIGRATION_SQL);
        }
    }

    private void ensureVarcharStatusColumn(JdbcTemplate jdbcTemplate) {
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

        if (columnType != null && columnType.toLowerCase(Locale.ROOT).equals("varchar(32)")) {
            log.info("Verified deliveries.status column type={}", columnType);
            return;
        }

        log.warn("Converting deliveries.status from type={} to VARCHAR(32)", columnType);
        jdbcTemplate.execute(STATUS_MIGRATION_SQL);

        String migratedColumnType = jdbcTemplate.queryForObject(
                """
                SELECT COLUMN_TYPE
                FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'deliveries'
                  AND COLUMN_NAME = 'status'
                """,
                String.class
        );
        if (migratedColumnType == null
                || !migratedColumnType.toLowerCase(Locale.ROOT).equals("varchar(32)")) {
            throw new IllegalStateException(
                    "Delivery status migration did not produce varchar(32); actual type=" + migratedColumnType
            );
        }
        log.info("Verified deliveries.status column type={}", migratedColumnType);
    }
}
