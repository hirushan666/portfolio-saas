# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
# Download dependencies for offline usage (improves build caching)
RUN mvn dependency:go-offline -B
# Copy source code and build
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Create the lightweight runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
