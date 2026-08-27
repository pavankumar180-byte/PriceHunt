package com.pricehunt.config;

import com.pricehunt.entity.*;
import com.pricehunt.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PlatformRepository platformRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductListingRepository productListingRepository;

    @Autowired
    private PriceHistoryRepository priceHistoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (platformRepository.count() == 0) {
            seedPlatforms();
        }
        if (userRepository.count() == 0) {
            seedDemoUser();
        }
        if (productRepository.count() == 0) {
            seedProductsAndListings();
        }
    }

    private void seedPlatforms() {
        platformRepository.saveAll(List.of(
            new Platform(null, "Amazon", "https://www.amazon.in", "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", 4.8),
            new Platform(null, "Flipkart", "https://www.flipkart.com", "https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png", 4.7),
            new Platform(null, "Croma", "https://www.croma.com", "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg", 4.6),
            new Platform(null, "Reliance Digital", "https://www.reliancedigital.in", "https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg", 4.55)
        ));
    }

    private void seedDemoUser() {
        User demo = new User("John Doe", "demo@pricehunt.com", passwordEncoder.encode("password123"), "ROLE_USER");
        userRepository.save(demo);
    }

    private void seedProductsAndListings() {
        Platform amazon = platformRepository.findByNameIgnoreCase("Amazon").orElse(null);
        Platform flipkart = platformRepository.findByNameIgnoreCase("Flipkart").orElse(null);
        Platform croma = platformRepository.findByNameIgnoreCase("Croma").orElse(null);
        Platform reliance = platformRepository.findByNameIgnoreCase("Reliance Digital").orElse(null);

        // 1. Apple iPhone 15
        Product p1 = new Product(
            "Apple iPhone 15 (128 GB, Blue)", "Apple", "iPhone 15", "Smartphones",
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
            "Dynamic Island, 48MP Main camera, USB-C, A16 Bionic chip, and all-day battery life.",
            "{\"storage\": \"128GB\", \"ram\": \"6GB\", \"color\": \"Blue\", \"display\": \"6.1-inch Super Retina XDR\"}"
        );
        productRepository.save(p1);

        ProductListing l1 = createListing(p1, amazon, "Apple iPhone 15 (128 GB) - Blue", new BigDecimal("64999.00"), new BigDecimal("79900.00"), 4.6, 3840, "Appario Retail Pvt Ltd", 4.8, BigDecimal.ZERO, 1, "https://www.amazon.in/dp/B0CHX1W1XY");
        ProductListing l2 = createListing(p1, flipkart, "Apple iPhone 15 (Blue, 128 GB)", new BigDecimal("63999.00"), new BigDecimal("79900.00"), 4.5, 4210, "SuperComNet", 4.6, BigDecimal.ZERO, 2, "https://www.flipkart.com/apple-iphone-15-blue-128-gb/p/itm12345");
        createListing(p1, croma, "Apple iPhone 15 128GB Blue (5G, A16 Bionic)", new BigDecimal("65490.00"), new BigDecimal("79900.00"), 4.4, 520, "Croma Official", 4.7, BigDecimal.ZERO, 1, "https://www.croma.com/apple-iphone-15-128gb-blue/p/274981");
        createListing(p1, reliance, "iPhone 15 128 GB, Blue - Apple", new BigDecimal("64499.00"), new BigDecimal("79900.00"), 4.3, 310, "Reliance Retail", 4.5, new BigDecimal("99.00"), 3, "https://www.reliancedigital.in/apple-iphone-15-128gb-blue/p/4938392");

        seedPriceHistory(l1, 64999);
        seedPriceHistory(l2, 63999);

        // 2. Samsung Galaxy S24
        Product p2 = new Product(
            "Samsung Galaxy S24 5G (8GB RAM, 128GB Storage, Onyx Black)", "Samsung", "Galaxy S24", "Smartphones",
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
            "Galaxy AI is here. Circle to Search, Live Translate, and ProVisual Engine with 50MP camera.",
            "{\"storage\": \"128GB\", \"ram\": \"8GB\", \"color\": \"Onyx Black\", \"display\": \"6.2-inch Dynamic AMOLED 2X\"}"
        );
        productRepository.save(p2);
        createListing(p2, amazon, "Samsung Galaxy S24 5G (Onyx Black, 8GB, 128GB Storage)", new BigDecimal("74999.00"), new BigDecimal("79999.00"), 4.5, 1250, "STPL Exclusive", 4.7, BigDecimal.ZERO, 1, "https://www.amazon.in/dp/B0CQ2W566R");
        createListing(p2, flipkart, "SAMSUNG Galaxy S24 5G (Onyx Black, 128 GB) (8 GB RAM)", new BigDecimal("72999.00"), new BigDecimal("79999.00"), 4.6, 1890, "IndiFlashMart", 4.7, BigDecimal.ZERO, 2, "https://www.flipkart.com/samsung-galaxy-s24-onyx-black/p/itm98765");
        createListing(p2, croma, "Samsung S24 5G 8GB/128GB Onyx Black", new BigDecimal("75999.00"), new BigDecimal("79999.00"), 4.3, 180, "Croma Official", 4.6, BigDecimal.ZERO, 1, "https://www.croma.com/samsung-s24-onyx-black/p/302911");

        // 3. Apple MacBook Air M3
        Product p3 = new Product(
            "Apple MacBook Air M3 Chip (13.6-inch, 8GB RAM, 256GB SSD, Space Grey)", "Apple", "MacBook Air M3", "Laptops",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
            "Strikingly thin and fast with the latest M3 processor, Liquid Retina display, and up to 18 hours of battery.",
            "{\"storage\": \"256GB SSD\", \"ram\": \"8GB Unified\", \"color\": \"Space Grey\", \"display\": \"13.6-inch Liquid Retina\"}"
        );
        productRepository.save(p3);
        createListing(p3, amazon, "Apple 2024 MacBook Air 13″ Laptop with M3 chip: Space Grey", new BigDecimal("104990.00"), new BigDecimal("114900.00"), 4.7, 890, "Appario Retail Pvt Ltd", 4.8, BigDecimal.ZERO, 1, "https://www.amazon.in/dp/B0CX23NS37");
        createListing(p3, flipkart, "Apple MacBook Air M3 - (8 GB/256 GB SSD/macOS Sonoma)", new BigDecimal("102990.00"), new BigDecimal("114900.00"), 4.6, 640, "TrueCom Retail", 4.5, BigDecimal.ZERO, 2, "https://www.flipkart.com/apple-macbook-air-m3/p/itmm3apple");
        createListing(p3, croma, "Apple MacBook Air 13.6 Inch M3 Chip 8GB RAM 256GB SSD", new BigDecimal("104490.00"), new BigDecimal("114900.00"), 4.5, 230, "Croma Online", 4.7, BigDecimal.ZERO, 1, "https://www.croma.com/apple-macbook-air-m3-space-grey/p/304889");

        // 4. Sony WH-1000XM5
        Product p4 = new Product(
            "Sony WH-1000XM5 Wireless Noise Canceling Headphones (Black)", "Sony", "WH-1000XM5", "Headphones",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
            "Industry leading noise cancellation with two processors and 8 microphones. 30-hour battery life.",
            "{\"type\": \"Over-Ear\", \"anc\": \"Yes\", \"battery\": \"30 Hours\", \"color\": \"Black\"}"
        );
        productRepository.save(p4);
        createListing(p4, amazon, "Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones - Black", new BigDecimal("26990.00"), new BigDecimal("34990.00"), 4.5, 5420, "Appario Retail Pvt Ltd", 4.8, BigDecimal.ZERO, 1, "https://www.amazon.in/dp/B09XS7JWHH");
        createListing(p4, flipkart, "SONY WH-1000XM5 Bluetooth Headset (Black, On the Ear)", new BigDecimal("25990.00"), new BigDecimal("34990.00"), 4.6, 4110, "OmniTech Retail", 4.6, BigDecimal.ZERO, 2, "https://www.flipkart.com/sony-wh-1000xm5-black/p/itmxm5sony");
        createListing(p4, croma, "Sony WH-1000XM5 Over-Ear Noise Cancelling Headphones (Black)", new BigDecimal("27990.00"), new BigDecimal("34990.00"), 4.4, 980, "Croma Official", 4.7, BigDecimal.ZERO, 1, "https://www.croma.com/sony-wh1000xm5-black/p/261901");
    }

    private ProductListing createListing(Product p, Platform plat, String title, BigDecimal price, BigDecimal origPrice,
                                         Double rating, Integer reviews, String seller, Double sellerRat, BigDecimal delivery,
                                         Integer days, String url) {
        ProductListing listing = new ProductListing();
        listing.setProduct(p);
        listing.setPlatform(plat);
        listing.setTitle(title);
        listing.setPrice(price);
        listing.setOriginalPrice(origPrice);
        listing.setRating(rating);
        listing.setReviewCount(reviews);
        listing.setSellerName(seller);
        listing.setSellerRating(sellerRat);
        listing.setDeliveryCost(delivery);
        listing.setDeliveryDays(days);
        listing.setInStock(true);
        listing.setProductUrl(url);
        return productListingRepository.save(listing);
    }

    private void seedPriceHistory(ProductListing listing, double current) {
        LocalDateTime now = LocalDateTime.now();
        priceHistoryRepository.saveAll(List.of(
            new PriceHistory(listing, BigDecimal.valueOf(current * 1.15), now.minusDays(90)),
            new PriceHistory(listing, BigDecimal.valueOf(current * 1.10), now.minusDays(60)),
            new PriceHistory(listing, BigDecimal.valueOf(current * 1.05), now.minusDays(30)),
            new PriceHistory(listing, BigDecimal.valueOf(current * 1.02), now.minusDays(15)),
            new PriceHistory(listing, BigDecimal.valueOf(current), now)
        ));
    }
}
