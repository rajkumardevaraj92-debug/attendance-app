CREATE DATABASE IF NOT EXISTS attendance_db;

USE attendance_db;

CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE CASCADE,

    UNIQUE(employee_id, attendance_date)
);

INSERT INTO employees (name, email, department)
VALUES
('Raj Kumar', 'raj@example.com', 'IT'),
('John Smith', 'john@example.com', 'HR'),
('Kumar Dev', 'kumar@example.com', 'Finance');
