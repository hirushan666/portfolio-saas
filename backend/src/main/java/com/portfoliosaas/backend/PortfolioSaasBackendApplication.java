package com.portfoliosaas.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PortfolioSaasBackendApplication {

	public static void main(String[] args) {
		// Load .env variables into System properties
		try {
			Dotenv dotenv = Dotenv.configure()
					.directory("./backend") // Since we are running from project root usually, but let's check current
											// dir too
					.ignoreIfMissing()
					.load();

			dotenv.entries().forEach(entry -> {
				System.setProperty(entry.getKey(), entry.getValue());
			});

			// Also try root .env if running from within backend folder
			Dotenv rootDotenv = Dotenv.configure()
					.ignoreIfMissing()
					.load();
			rootDotenv.entries().forEach(entry -> {
				if (System.getProperty(entry.getKey()) == null) {
					System.setProperty(entry.getKey(), entry.getValue());
				}
			});
		} catch (Exception e) {
			System.out.println("No .env file found or failed to load. Using system environment variables.");
		}

		SpringApplication.run(PortfolioSaasBackendApplication.class, args);
	}

}
