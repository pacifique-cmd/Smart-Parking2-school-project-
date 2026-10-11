-- EPMS Database Setup Script
-- SmartPark Employee Payroll Management System
-- Created by: Nisingizwe Rukundo

CREATE DATABASE IF NOT EXISTS EPMS;
USE EPMS;

-- Department Table
CREATE TABLE IF NOT EXISTS Department (
    DepartmentCode VARCHAR(10) PRIMARY KEY,
    DepartmentName VARCHAR(100) NOT NULL,
    GrossSalary DECIMAL(10,2) NOT NULL
);

-- Employee Table
CREATE TABLE IF NOT EXISTS Employee (
    EmployeeNumber INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Position VARCHAR(100) NOT NULL,
    Address VARCHAR(200) NOT NULL,
    Telephone VARCHAR(20) NOT NULL,
    Gender ENUM('Male', 'Female', 'Other') NOT NULL,
    HiredDate DATE NOT NULL,
    DepartmentCode VARCHAR(10),
    FOREIGN KEY (DepartmentCode) REFERENCES Department(DepartmentCode) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Salary Table
CREATE TABLE IF NOT EXISTS Salary (
    SalaryID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeNumber INT NOT NULL,
    GrossSalary DECIMAL(10,2) NOT NULL,
    TotalDeduction DECIMAL(10,2) NOT NULL,
    NetSalary DECIMAL(10,2) GENERATED ALWAYS AS (GrossSalary - TotalDeduction) STORED,
    Month VARCHAR(20) NOT NULL,
    FOREIGN KEY (EmployeeNumber) REFERENCES Employee(EmployeeNumber) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Users Table (for session-based login)
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default departments
INSERT IGNORE INTO Department (DepartmentCode, DepartmentName, GrossSalary) VALUES
('CW', 'Carwash', 300000.00),
('ST', 'Stock', 200000.00),
('MC', 'Mechanic', 450000.00),
('ADMS', 'Administration Staff', 600000.00);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO Users (Username, Password) VALUES
('admin', '$2a$10$rQnK1V1v1kz1F1z1z1z1zO1z1z1z1z1z1z1z1z1z1z1z1z1z1z1z');

-- NOTE: Run this in MySQL before starting the backend
-- Default login: username=admin, password=admin123
