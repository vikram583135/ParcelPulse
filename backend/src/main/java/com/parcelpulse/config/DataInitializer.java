/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
package com.parcelpulse.config;

import com.parcelpulse.domain.User;
import com.parcelpulse.domain.enums.UserRole;
import com.parcelpulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Seeding demo users...");

            userRepository.save(User.builder()
                    .name("Nike Marketing").email("nike@demo.com").password("demo123")
                    .phone("9876543210").role(UserRole.ADVERTISER).active(true).build());

            userRepository.save(User.builder()
                    .name("Adidas India").email("adidas@demo.com").password("demo123")
                    .phone("9876543211").role(UserRole.ADVERTISER).active(true).build());

            userRepository.save(User.builder()
                    .name("Agent Ravi").email("ravi@demo.com").password("demo123")
                    .phone("9876543220").role(UserRole.AGENT).active(true).build());

            userRepository.save(User.builder()
                    .name("Agent Priya").email("priya.agent@demo.com").password("demo123")
                    .phone("9876543221").role(UserRole.AGENT).active(true).build());

            userRepository.save(User.builder()
                    .name("Rider Arun").email("arun@demo.com").password("demo123")
                    .phone("9876543230").role(UserRole.RIDER).active(true).build());

            userRepository.save(User.builder()
                    .name("Rider Sneha").email("sneha@demo.com").password("demo123")
                    .phone("9876543231").role(UserRole.RIDER).active(true).build());

            userRepository.save(User.builder()
                    .name("Rider Karthik").email("karthik@demo.com").password("demo123")
                    .phone("9876543232").role(UserRole.RIDER).active(true).build());

            userRepository.save(User.builder()
                    .name("Admin ParcelPulse").email("admin@parcelpulse.com").password("admin123")
                    .phone("9876543200").role(UserRole.ADMIN).active(true).build());

            log.info("Demo users seeded successfully!");
        }
    }
}
