package com.pricehunt.integration.marketplace;

public enum IntegrationStatusEnum {
    CONNECTED("Connected"),
    CREDENTIALS_MISSING("Credentials Missing"),
    AUTHORIZATION_REQUIRED("Authorization Required"),
    PERMISSION_NOT_CONFIRMED("Permission Not Confirmed"),
    TEMPORARILY_UNAVAILABLE("Temporarily Unavailable"),
    UNSUPPORTED("Unsupported");

    private final String displayName;

    IntegrationStatusEnum(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

