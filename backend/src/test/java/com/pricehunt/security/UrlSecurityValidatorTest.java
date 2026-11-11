package com.pricehunt.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.net.InetAddress;
import java.net.URI;

import static org.junit.jupiter.api.Assertions.*;

class UrlSecurityValidatorTest {

    private UrlSecurityValidator validator;

    @BeforeEach
    void setUp() {
        validator = new UrlSecurityValidator();
    }

    @Test
    @DisplayName("Should accept valid Amazon India product URL")
    void testValidAmazonUrl() {
        URI uri = validator.validateAndNormalizeUrl("https://www.amazon.in/dp/B0CHX1W1XY");
        assertNotNull(uri);
        assertEquals("amazon.in", validator.extractNormalizedDomain("https://www.amazon.in/dp/B0CHX1W1XY"));
    }

    @Test
    @DisplayName("Should accept valid Flipkart product URL")
    void testValidFlipkartUrl() {
        URI uri = validator.validateAndNormalizeUrl("https://www.flipkart.com/apple-iphone-15-blue-128-gb/p/itmbf5553733dec9");
        assertNotNull(uri);
        assertEquals("flipkart.com", validator.extractNormalizedDomain("https://www.flipkart.com/apple-iphone-15-blue-128-gb/p/itmbf5553733dec9"));
    }

    @Test
    @DisplayName("Should block loopback localhost (SSRF protection)")
    void testBlockLocalhost() {
        Exception ex = assertThrows(SecurityException.class, () -> {
            validator.validateAndNormalizeUrl("http://localhost:8080/admin");
        });
        assertTrue(ex.getMessage().contains("local or internal hostnames"));
    }

    @Test
    @DisplayName("Should block loopback 127.0.0.1 IP (SSRF protection)")
    void testBlockLoopbackIp() {
        Exception ex = assertThrows(SecurityException.class, () -> {
            validator.validateAndNormalizeUrl("http://127.0.0.1:8080/actuator");
        });
        assertTrue(ex.getMessage().contains("restricted private or internal IP"));
    }

    @Test
    @DisplayName("Should block private IP 192.168.x.x (SSRF protection)")
    void testBlockPrivateNetwork() throws Exception {
        InetAddress privateIp = InetAddress.getByName("192.168.1.1");
        assertTrue(validator.isPrivateOrRestrictedIp(privateIp));
    }

    @Test
    @DisplayName("Should block cloud metadata service 169.254.169.254 (SSRF protection)")
    void testBlockCloudMetadata() throws Exception {
        InetAddress metadataIp = InetAddress.getByName("169.254.169.254");
        assertTrue(validator.isPrivateOrRestrictedIp(metadataIp));
    }

    @Test
    @DisplayName("Should reject unsupported marketplace domain")
    void testRejectUnsupportedDomain() {
        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            validator.validateAndNormalizeUrl("https://www.walmart.com/ip/some-product/123456");
        });
        assertTrue(ex.getMessage().contains("Unsupported marketplace"));
    }
}
