-- ParcelPulse Database Setup
-- Run this script to create the database before starting the backend

CREATE DATABASE parcelpulse;

-- The tables will be auto-created by Hibernate (ddl-auto=update)
-- This script only creates the database itself

-- To connect:
-- psql -U postgres -h localhost
-- \c parcelpulse

-- Default credentials in application.properties:
-- URL: jdbc:postgresql://localhost:5432/parcelpulse
-- Username: postgres
-- Password: postgres
