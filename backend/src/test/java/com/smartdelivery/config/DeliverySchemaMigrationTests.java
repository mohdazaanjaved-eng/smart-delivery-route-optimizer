package com.smartdelivery.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.ApplicationArguments;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DeliverySchemaMigrationTests {

    @Test
    void convertsLegacyEnumToVarcharAndIsIdempotent() throws Exception {
        @SuppressWarnings("unchecked")
        ObjectProvider<JdbcTemplate> provider = mock(ObjectProvider.class);
        JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
        DataSource dataSource = mock(DataSource.class);
        Connection connection = mock(Connection.class);
        DatabaseMetaData metadata = mock(DatabaseMetaData.class);

        when(provider.getIfAvailable()).thenReturn(jdbcTemplate);
        when(jdbcTemplate.getDataSource()).thenReturn(dataSource);
        when(dataSource.getConnection()).thenReturn(connection);
        when(connection.getMetaData()).thenReturn(metadata);
        when(metadata.getDatabaseProductName()).thenReturn("MySQL");
        when(jdbcTemplate.queryForObject(contains("information_schema.TABLES"), eq(Integer.class)))
                .thenReturn(1);
        when(jdbcTemplate.queryForObject(contains("COLUMN_NAME = 'completed_at'"), eq(Integer.class)))
                .thenReturn(0, 1);
        when(jdbcTemplate.queryForObject(contains("COLUMN_NAME = 'status'"), eq(String.class)))
                .thenReturn(
                        "enum('ASSIGNED','DELIVERED','IN_PROGRESS','PENDING')",
                        "varchar(32)",
                        "varchar(32)"
                );

        DeliverySchemaMigration migration = new DeliverySchemaMigration(provider);
        ApplicationArguments arguments = mock(ApplicationArguments.class);
        migration.run(arguments);
        migration.run(arguments);

        verify(jdbcTemplate, times(1)).execute(DeliverySchemaMigration.COMPLETED_AT_MIGRATION_SQL);
        verify(jdbcTemplate, times(1)).execute(DeliverySchemaMigration.STATUS_MIGRATION_SQL);
    }
}
