package com.pricehunt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the PriceHunt Spring Boot Application.
 */
@SpringBootApplication
public class PriceHuntApplication {

    public static void main(String[] args) {
        SpringApplication.run(PriceHuntApplication.class, args);
        System.out.println("\n=======================================================");
        System.out.println("  PRICEHUNT BACKEND SERVER RUNNING ON PORT 8080");
        System.out.println("  REST API Base URL: http://localhost:8080/api");
        System.out.println("=======================================================\n");
    }
}
