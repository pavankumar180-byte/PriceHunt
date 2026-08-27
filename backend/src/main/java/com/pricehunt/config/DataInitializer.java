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
            seedExpandedCatalog();
        }
    }

    private void seedPlatforms() {
        platformRepository.saveAll(List.of(
            new Platform(null, "Amazon", "https://www.amazon.in", "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", 4.8),
            new Platform(null, "Flipkart", "https://www.flipkart.com", "https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png", 4.7),
            new Platform(null, "Croma", "https://www.croma.com", "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20icon/Croma_Logo_acrkvn.svg", 4.6),
            new Platform(null, "Myntra", "https://www.myntra.com", "https://images.indianexpress.com/2021/01/myntra.png", 4.7),
            new Platform(null, "Reliance Digital", "https://www.reliancedigital.in", "https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg", 4.55)
        ));
    }

    private void seedDemoUser() {
        User demo = new User("John Doe", "demo@pricehunt.com", passwordEncoder.encode("password123"), "ROLE_USER");
        userRepository.save(demo);
    }

    private void seedExpandedCatalog() {
        Platform amazon = platformRepository.findByNameIgnoreCase("Amazon").orElse(null);
        Platform flipkart = platformRepository.findByNameIgnoreCase("Flipkart").orElse(null);
        Platform myntra = platformRepository.findByNameIgnoreCase("Myntra").orElse(null);

        // --- SMARTPHONES ---
        Product p1 = saveProduct("Apple iPhone 15 (128 GB, Blue)", "Apple", "iPhone 15", "Smartphones",
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
            "Dynamic Island, 48MP Main camera, USB-C, A16 Bionic chip, and all-day battery life.",
            "{\"storage\": \"128GB\", \"ram\": \"6GB\", \"color\": \"Blue\"}");
        createListing(p1, amazon, "Apple iPhone 15 (128 GB) - Blue", new BigDecimal("64999"), new BigDecimal("79900"), 4.6, 3840, "Appario Retail", 4.8, BigDecimal.ZERO, 1, "https://www.amazon.in");
        createListing(p1, flipkart, "Apple iPhone 15 (Blue, 128 GB)", new BigDecimal("63999"), new BigDecimal("79900"), 4.5, 4210, "SuperComNet", 4.6, BigDecimal.ZERO, 2, "https://www.flipkart.com");

        Product p2 = saveProduct("Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)", "Samsung", "Galaxy S24 Ultra", "Smartphones",
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
            "Galaxy AI is here. Titanium frame, 200MP camera, built-in S Pen, and Snapdragon 8 Gen 3.",
            "{\"storage\": \"256GB\", \"ram\": \"12GB\", \"color\": \"Titanium Gray\"}");
        createListing(p2, flipkart, "SAMSUNG Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)", new BigDecimal("119999"), new BigDecimal("129999"), 4.7, 1890, "IndiFlashMart", 4.7, BigDecimal.ZERO, 2, "https://www.flipkart.com");
        createListing(p2, amazon, "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB)", new BigDecimal("121999"), new BigDecimal("129999"), 4.6, 2250, "STPL Exclusive", 4.8, BigDecimal.ZERO, 1, "https://www.amazon.in");

        // --- LAPTOPS ---
        Product p3 = saveProduct("Apple MacBook Air M3 Chip (13.6-inch, 8GB RAM, 256GB SSD, Space Grey)", "Apple", "MacBook Air M3", "Laptops",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
            "Strikingly thin and fast with the latest M3 processor, Liquid Retina display, and 18-hour battery.",
            "{\"storage\": \"256GB SSD\", \"ram\": \"8GB Unified\", \"color\": \"Space Grey\"}");
        createListing(p3, flipkart, "Apple MacBook Air M3 (8 GB/256 GB SSD)", new BigDecimal("102990"), new BigDecimal("114900"), 4.6, 640, "TrueCom", 4.5, BigDecimal.ZERO, 2, "https://www.flipkart.com");
        createListing(p3, amazon, "Apple 2024 MacBook Air 13″ Laptop with M3 chip", new BigDecimal("104990"), new BigDecimal("114900"), 4.7, 890, "Appario Retail", 4.8, BigDecimal.ZERO, 1, "https://www.amazon.in");

        Product p4 = saveProduct("Dell XPS 15 9530 Laptop (Intel Core i7-13700H, 16GB RAM, 1TB SSD, RTX 4050)", "Dell", "XPS 15", "Laptops",
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
            "Stunning 3.5K OLED InfinityEdge display, RTX 4050 6GB graphics, machined aluminum chassis.",
            "{\"storage\": \"1TB NVMe SSD\", \"ram\": \"16GB DDR5\", \"processor\": \"Intel Core i7\"}");
        createListing(p4, flipkart, "DELL XPS 15 Core i7 13th Gen - (16 GB/1 TB SSD/RTX 4050)", new BigDecimal("184990"), new BigDecimal("225990"), 4.4, 145, "FlashTech", 4.5, BigDecimal.ZERO, 3, "https://www.flipkart.com");
        createListing(p4, amazon, "Dell XPS 15 9530 Laptop, Intel i7-13700H, RTX 4050", new BigDecimal("189990"), new BigDecimal("225990"), 4.5, 210, "Dell Authorized", 4.8, BigDecimal.ZERO, 2, "https://www.amazon.in");

        Product p5 = saveProduct("ASUS ROG Zephyrus G14 Gaming Laptop (Ryzen 9, 16GB RAM, 1TB SSD, RTX 4060)", "ASUS", "ROG Zephyrus G14", "Laptops",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
            "Ultra-portable gaming beast with 3K 120Hz OLED display, AMD Ryzen 9, and RTX 4060.",
            "{\"storage\": \"1TB SSD\", \"ram\": \"16GB\", \"gpu\": \"RTX 4060 8GB\"}");
        createListing(p5, amazon, "ASUS ROG Zephyrus G14 (2024) 3K OLED, Ryzen 9, RTX 4060", new BigDecimal("149990"), new BigDecimal("174990"), 4.6, 380, "Appario Retail", 4.8, BigDecimal.ZERO, 1, "https://www.amazon.in");

        // --- SHOES ---
        Product p6 = saveProduct("Nike Air Jordan 1 Retro High OG (Chicago Red/White/Black)", "Nike", "Air Jordan 1 Retro", "Shoes",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
            "The iconic high-top basketball sneaker crafted with genuine premium leather.",
            "{\"type\": \"High-Top Sneaker\", \"material\": \"Genuine Leather\", \"color\": \"Chicago Red\"}");
        createListing(p6, myntra, "Nike Air Jordan 1 Retro High OG Sneakers", new BigDecimal("14995"), new BigDecimal("17995"), 4.8, 1240, "Nike Official Store", 4.9, BigDecimal.ZERO, 2, "https://www.myntra.com");
        createListing(p6, amazon, "Nike Mens Air Jordan 1 Retro High Basketball Shoes", new BigDecimal("15995"), new BigDecimal("17995"), 4.7, 850, "SoleHub", 4.7, BigDecimal.ZERO, 1, "https://www.amazon.in");

        Product p7 = saveProduct("Adidas Ultraboost Light Running Shoes (Core Black / Solar Red)", "Adidas", "Ultraboost Light", "Shoes",
            "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
            "Experience epic energy with the lightest Ultraboost ever made. Continental rubber sole.",
            "{\"type\": \"Running Shoe\", \"cushioning\": \"Light BOOST\", \"color\": \"Core Black\"}");
        createListing(p7, myntra, "Adidas Men Ultraboost Light Running Shoes", new BigDecimal("9999"), new BigDecimal("18999"), 4.6, 2310, "Adidas India", 4.8, BigDecimal.ZERO, 2, "https://www.myntra.com");

        Product p8 = saveProduct("New Balance 550 Vintage White Lifestyle Sneakers", "New Balance", "550", "Shoes",
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&auto=format&fit=crop&q=80",
            "A tribute to the 1989 basketball pro shoe that defined a generation.",
            "{\"type\": \"Retro Low-Top\", \"material\": \"Leather & Suede\", \"color\": \"White/Navy\"}");
        createListing(p8, myntra, "New Balance Unisex 550 Retro Low-Top Sneakers", new BigDecimal("8499"), new BigDecimal("10999"), 4.7, 680, "Brandz Retail", 4.7, BigDecimal.ZERO, 2, "https://www.myntra.com");

        // --- WATCHES ---
        Product p9 = saveProduct("Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium Case with Ocean Band)", "Apple", "Watch Ultra 2", "Watches",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
            "The most rugged and capable Apple Watch. Powered by S9 SiP with 3000-nit display.",
            "{\"case\": \"49mm Titanium\", \"display\": \"3000-nit Retina\", \"battery\": \"36 Hours\"}");
        createListing(p9, amazon, "Apple Watch Ultra 2 [GPS + Cellular 49 mm] Titanium Case", new BigDecimal("84900"), new BigDecimal("89900"), 4.8, 950, "Appario Retail", 4.8, BigDecimal.ZERO, 1, "https://www.amazon.in");

        Product p10 = saveProduct("Samsung Galaxy Watch 6 Classic (47mm, Bluetooth, Rotating Bezel, Silver)", "Samsung", "Galaxy Watch 6 Classic", "Watches",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
            "Timeless stainless steel style featuring physical rotating bezel and BioActive sensor.",
            "{\"size\": \"47mm Stainless Steel\", \"bezel\": \"Rotating\", \"battery\": \"40 Hours\"}");
        createListing(p10, flipkart, "SAMSUNG Galaxy Watch6 Classic (Bluetooth, 47mm, Silver)", new BigDecimal("28999"), new BigDecimal("41999"), 4.6, 1540, "IndiFlashMart", 4.7, BigDecimal.ZERO, 2, "https://www.flipkart.com");

        Product p11 = saveProduct("Fossil Grant Chronograph Dark Brown Leather Watch (FS4813)", "Fossil", "Grant Chronograph", "Watches",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80",
            "Vintage-inspired classic quartz chronograph watch with Roman numerals and genuine leather band.",
            "{\"case\": \"44mm Steel\", \"strap\": \"Leather\", \"movement\": \"Quartz Chronograph\"}");
        createListing(p11, myntra, "Fossil Men Grant Chronograph Analogue Watch FS4813", new BigDecimal("7495"), new BigDecimal("13495"), 4.6, 3410, "Fossil India", 4.8, BigDecimal.ZERO, 2, "https://www.myntra.com");

        // --- AUDIO ---
        Product p12 = saveProduct("Sony WH-1000XM5 Wireless Noise Canceling Headphones (Black)", "Sony", "WH-1000XM5", "Headphones",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
            "Industry leading noise cancellation with two processors and 8 microphones. 30-hour battery life.",
            "{\"type\": \"Over-Ear\", \"anc\": \"Yes\", \"battery\": \"30 Hours\"}");
        createListing(p12, flipkart, "SONY WH-1000XM5 Bluetooth Headset (Black)", new BigDecimal("25990"), new BigDecimal("34990"), 4.6, 4110, "OmniTech", 4.6, BigDecimal.ZERO, 2, "https://www.flipkart.com");
        createListing(p12, amazon, "Sony WH-1000XM5 Wireless ANC Headphones - Black", new BigDecimal("26990"), new BigDecimal("34990"), 4.5, 5420, "Appario Retail", 4.8, BigDecimal.ZERO, 1, "https://www.amazon.in");

        Product p13 = saveProduct("Apple AirPods Pro (2nd Gen with USB-C MagSafe Case)", "Apple", "AirPods Pro 2", "Headphones",
            "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
            "Up to 2x more Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio.",
            "{\"type\": \"In-Ear TWS\", \"chip\": \"H2\", \"anc\": \"Yes\"}");
        createListing(p13, flipkart, "Apple AirPods Pro (2nd generation) USB-C", new BigDecimal("19999"), new BigDecimal("24900"), 4.8, 8740, "SuperComNet", 4.7, BigDecimal.ZERO, 2, "https://www.flipkart.com");
    }

    private Product saveProduct(String name, String brand, String model, String category, String img, String desc, String specs) {
        Product p = new Product(name, brand, model, category, img, desc, specs);
        return productRepository.save(p);
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
}
