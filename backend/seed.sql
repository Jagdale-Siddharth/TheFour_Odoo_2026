-- =====================================================================
-- TransitOps demo seed data
-- Password for ALL seeded users is: password123
-- (hash below is bcrypt of "password123")
-- =====================================================================

INSERT INTO users (name, email, password_hash, role, region) VALUES
('Priya Sharma', 'fleet@transitops.com', '$2a$10$yvTOOL6Ju8yDNom3YGx/neoeyu0ys/MOMwIR5NhAje0oOXC0l.uFm', 'FleetManager', 'West'),
('Rahul Verma', 'driver@transitops.com', '$2a$10$yvTOOL6Ju8yDNom3YGx/neoeyu0ys/MOMwIR5NhAje0oOXC0l.uFm', 'Driver', 'West'),
('Anita Rao', 'safety@transitops.com', '$2a$10$yvTOOL6Ju8yDNom3YGx/neoeyu0ys/MOMwIR5NhAje0oOXC0l.uFm', 'SafetyOfficer', 'North'),
('Karan Mehta', 'finance@transitops.com', '$2a$10$yvTOOL6Ju8yDNom3YGx/neoeyu0ys/MOMwIR5NhAje0oOXC0l.uFm', 'FinancialAnalyst', 'South');

INSERT INTO vehicles (registration_number, name, type, max_load_capacity, odometer, acquisition_cost, status, region) VALUES
('MH-12-AB-1234', 'Van-05', 'Van', 500, 18500, 850000, 'Available', 'West'),
('MH-14-CD-5678', 'Truck-11', 'Truck', 2500, 42000, 2200000, 'Available', 'West'),
('DL-03-EF-9012', 'Mini-Truck-02', 'Mini Truck', 1200, 30500, 1350000, 'In Shop', 'North'),
('KA-05-GH-3456', 'Van-09', 'Van', 600, 9800, 900000, 'Available', 'South'),
('TN-09-IJ-7890', 'Truck-21', 'Truck', 3000, 61200, 2600000, 'Retired', 'South');

INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number, safety_score, status, region) VALUES
('Alex Fernandes', 'DL-2019-001122', 'LMV', '2027-06-30', '9876543210', 96.5, 'Available', 'West'),
('Suresh Kumar', 'DL-2020-004455', 'HMV', '2026-11-15', '9876500011', 88.0, 'Available', 'West'),
('Neha Joshi', 'DL-2018-007788', 'HMV', '2025-09-01', '9876511122', 72.0, 'Suspended', 'North'),
('Vikram Singh', 'DL-2021-003399', 'LMV', '2028-01-20', '9876522233', 91.2, 'Available', 'South');

INSERT INTO maintenance_logs (vehicle_id, service_type, description, cost, status, started_at) VALUES
(3, 'Engine Overhaul', 'Scheduled engine service after 30k km', 45000, 'Open', NOW() - INTERVAL '2 days');

INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, actual_distance, fuel_consumed, revenue, status, dispatched_at, completed_at, created_by) VALUES
('Mumbai', 'Pune', 1, 1, 450, 150, 155, 18, 12000, 'Completed', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', 1),
('Mumbai', 'Nashik', 2, 2, 2200, 210, 215, 32, 21000, 'Completed', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', 1);

INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, log_date) VALUES
(1, 1, 18, 1800, CURRENT_DATE - 4),
(2, 2, 32, 3200, CURRENT_DATE - 2);

INSERT INTO expenses (vehicle_id, trip_id, category, amount, expense_date, notes) VALUES
(1, 1, 'Toll', 350, CURRENT_DATE - 4, 'Mumbai-Pune expressway toll'),
(2, 2, 'Toll', 500, CURRENT_DATE - 2, 'Mumbai-Nashik toll');
