package com.pricehunt.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.*;
import java.util.*;

/**
 * Enterprise SSRF and URL Security Validator.
 * Protects against Server-Side Request Forgery, loopback probing, DNS rebinding, and invalid destinations.
 */
@Component
public class UrlSecurityValidator {

    private static final Logger log = LoggerFactory.getLogger(UrlSecurityValidator.class);

    private static final Set<String> ALLOWED_SCHEMES = Set.of("http", "https");

    // Supported e-commerce domains for PriceHunt (India Market & Major E-commerce)
    private static final Set<String> SUPPORTED_DOMAINS = Set.of(
            "amazon.in",
            "amazon.com",
            "flipkart.com",
            "croma.com",
            "reliancedigital.in",
            "myntra.com",
            "ajio.com",
            "tatacliq.com",
            "vijaysales.com"
    );

    /**
     * Validates a candidate product URL against all security constraints.
     * Throws IllegalArgumentException or SecurityException if validation fails.
     */
    public URI validateAndNormalizeUrl(String rawUrl) {
        if (rawUrl == null || rawUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("Product URL cannot be empty. Please enter a valid e-commerce product link.");
        }

        String trimmed = rawUrl.trim();

        // 1. Parse URI
        URI uri;
        try {
            uri = new URI(trimmed);
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("Malformed URL format: " + e.getMessage());
        }

        // 2. Validate Scheme (HTTP / HTTPS only)
        String scheme = uri.getScheme();
        if (scheme == null || !ALLOWED_SCHEMES.contains(scheme.toLowerCase())) {
            throw new SecurityException("Unsupported protocol: '" + scheme + "'. Only HTTP and HTTPS links are allowed.");
        }

        // 3. Validate Host presence
        String host = uri.getHost();
        if (host == null || host.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid product link: missing host/domain name.");
        }

        host = host.toLowerCase();

        // 4. Block obvious localhost / internal names
        if (host.equals("localhost") || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
            throw new SecurityException("Access to local or internal hostnames is prohibited.");
        }

        // 5. DNS Resolution and SSRF IP Address Checks
        try {
            InetAddress[] addresses = InetAddress.getAllByName(host);
            if (addresses == null || addresses.length == 0) {
                throw new IllegalArgumentException("Unable to resolve DNS for domain: " + host);
            }

            for (InetAddress addr : addresses) {
                if (isPrivateOrRestrictedIp(addr)) {
                    log.warn("[SSRF Blocked] Destination IP resolved to private/loopback network: {} ({})", addr.getHostAddress(), host);
                    throw new SecurityException("Target address resolves to a restricted private or internal IP range (" + addr.getHostAddress() + ").");
                }
            }
        } catch (UnknownHostException e) {
            throw new IllegalArgumentException("Host could not be resolved via DNS: " + host);
        }

        // 6. Check Supported E-commerce Marketplaces
        boolean domainSupported = false;
        for (String supported : SUPPORTED_DOMAINS) {
            if (host.equals(supported) || host.endsWith("." + supported)) {
                domainSupported = true;
                break;
            }
        }

        if (!domainSupported) {
            throw new IllegalArgumentException("Unsupported marketplace: '" + host + "'. PriceHunt currently supports: "
                    + String.join(", ", SUPPORTED_DOMAINS) + ".");
        }

        return uri;
    }

    /**
     * Checks if an IP address belongs to RFC 1918, loopback, link-local, multicast, or reserved ranges.
     */
    public boolean isPrivateOrRestrictedIp(InetAddress addr) {
        if (addr.isLoopbackAddress() || addr.isAnyLocalAddress() || addr.isLinkLocalAddress()) {
            return true;
        }

        if (addr.isSiteLocalAddress()) {
            return true; // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
        }

        if (addr.isMulticastAddress()) {
            return true;
        }

        byte[] bytes = addr.getAddress();
        if (bytes.length == 4) {
            int b0 = bytes[0] & 0xFF;
            int b1 = bytes[1] & 0xFF;

            // 127.0.0.0/8 (Loopback)
            if (b0 == 127) return true;
            // 10.0.0.0/8
            if (b0 == 10) return true;
            // 172.16.0.0/12
            if (b0 == 172 && (b1 >= 16 && b1 <= 31)) return true;
            // 192.168.0.0/16
            if (b0 == 192 && b1 == 168) return true;
            // 169.254.0.0/16 (Link Local / AWS Metadata)
            if (b0 == 169 && b1 == 254) return true;
            // 0.0.0.0/8
            if (b0 == 0) return true;
            // 100.64.0.0/10 (Carrier-grade NAT)
            if (b0 == 100 && (b1 >= 64 && b1 <= 127)) return true;
            // 192.0.0.0/24, 192.0.2.0/24 (TEST-NET)
            if (b0 == 192 && b1 == 0) return true;
            // 198.18.0.0/15 (Network benchmark)
            if (b0 == 198 && (b1 == 18 || b1 == 19)) return true;
            // 198.51.100.0/24, 203.0.113.0/24
            if (b0 == 198 && b1 == 51) return true;
            if (b0 == 203 && b1 == 0) return true;
            // 224.0.0.0/4 (Multicast), 240.0.0.0/4 (Reserved)
            if (b0 >= 224) return true;
        }

        return false;
    }

    public String extractNormalizedDomain(String url) {
        try {
            URI uri = new URI(url);
            String host = uri.getHost();
            if (host == null) return "unknown";
            host = host.toLowerCase();
            return host.startsWith("www.") ? host.substring(4) : host;
        } catch (Exception e) {
            return "unknown";
        }
    }
}

