package com.portfoliosaas.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class PortfolioSaasBackendApplication {

	public static void main(String[] args) {

		Dotenv dotenv = Dotenv.load(); // loads .env automatically
		SpringApplication.run(PortfolioSaasBackendApplication.class, args);
	}

}
