package com.pricehunt.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        File frontendDir = new File("../frontend");
        if (!frontendDir.exists()) {
            frontendDir = new File("frontend");
        }

        if (frontendDir.exists()) {
            String path = "file:" + frontendDir.getAbsolutePath().replace("\\", "/") + "/";
            registry.addResourceHandler("/**")
                    .addResourceLocations(path, "classpath:/static/", "classpath:/public/");
        }
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}

