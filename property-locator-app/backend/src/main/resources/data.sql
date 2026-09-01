INSERT INTO users (username, email, password_hash) VALUES
('demo_user', 'demo@example.com', '$2a$10$SYDHx8KZfxU4xYNj.TmGAuRqRkL/3s0TjcGY.G1LN7L2hFDkGR1Wm');

INSERT INTO cities (city_name, state_name, country_name) VALUES
('Mumbai', 'Maharashtra', 'India'),
('Pune', 'Maharashtra', 'India'),
('Bengaluru', 'Karnataka', 'India');

INSERT INTO streets (city_id, street_name) VALUES
(1, 'Andheri West'),
(2, 'Baner'),
(3, 'Koramangala');

INSERT INTO properties (owner_id, street_id, title, description, property_type, price, house_number, unit_number, bedrooms, square_feet, year_built, latitude, longitude) VALUES
(1, 1, '2BHK Flat in Andheri West', 'Spacious 2BHK apartment near metro', 'APARTMENT', 7500000.00, '12', 'A', 2, 1200, 2020, 19.11360000, 72.86970000),
(1, 2, '3BHK Villa in Baner', 'Luxury villa with garden and parking', 'VILLA', 14500000.00, '45', NULL, 3, 2200, 2019, 18.55940000, 73.77670000),
(1, 3, '1BHK Apartment in Koramangala', 'Compact home in a prime residential area', 'APARTMENT', 6000000.00, '88', '2B', 1, 850, 2018, 12.93520000, 77.62450000);
