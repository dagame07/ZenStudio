package org.javabugs.zenstudio.web;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.sql.DataSource;

import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** GET /api/health: confirma que la API vive y a qué base de datos está conectada. */
@RestController
@RequestMapping("/api")
public class HealthController {

    private final DataSource dataSource;
    private final Environment env;

    public HealthController(DataSource dataSource, Environment env) {
        this.dataSource = dataSource;
        this.env = env;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("status", "UP");
        out.put("profiles", env.getActiveProfiles());
        try (Connection c = dataSource.getConnection()) {
            out.put("database", c.getMetaData().getDatabaseProductName());
        } catch (SQLException e) {
            out.put("status", "DEGRADED");
            out.put("database", "no disponible");
        }
        return out;
    }
}
