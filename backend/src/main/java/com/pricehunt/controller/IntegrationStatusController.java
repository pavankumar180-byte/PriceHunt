package com.pricehunt.controller;

import com.pricehunt.integration.marketplace.MarketplaceAdapter;
import com.pricehunt.integration.marketplace.MarketplaceRegistry;
import com.pricehunt.integration.marketplace.MarketplaceStatusDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/integrations")
public class IntegrationStatusController {

    @Autowired
    private MarketplaceRegistry marketplaceRegistry;

    /**
     * Developer & Admin status endpoint for all e-commerce marketplace integrations.
     */
    @GetMapping("/status")
    public ResponseEntity<List<MarketplaceStatusDto>> getAllStatuses() {
        return ResponseEntity.ok(marketplaceRegistry.getAllStatuses());
    }

    /**
     * Executes connection diagnostics for a specific marketplace.
     */
    @PostMapping("/test/{domain}")
    public ResponseEntity<?> testMarketplaceConnection(@PathVariable String domain) {
        Optional<MarketplaceAdapter> adapterOpt = marketplaceRegistry.findAdapterForDomain(domain);
        if (adapterOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Marketplace domain '" + domain + "' is not registered."
            ));
        }

        MarketplaceAdapter adapter = adapterOpt.get();
        boolean connected = adapter.testConnection();
        MarketplaceStatusDto status = adapter.getStatus();

        return ResponseEntity.ok(Map.of(
                "marketplace", adapter.getPlatformName(),
                "domain", adapter.getDomain(),
                "status", status.getStatus(),
                "connected", connected,
                "credentialsConfigured", status.isCredentialsConfigured(),
                "reason", status.getReason(),
                "setupInstructions", status.getSetupInstructions()
        ));
    }
}

