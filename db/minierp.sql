-- Inicialització neta de la base de dades
CREATE DATABASE IF NOT EXISTS minierp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE minierp;

-- Eliminar taules en ordre correcte per claus foranes
DROP TABLE IF EXISTS sale_items;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

-- 1. Crear Taula de Clients
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

-- 2. Crear Taula de Productes
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- 3. Crear Taula de Vendes (Capçalera)
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50) NOT NULL,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. Crear Taula de Detalls de Venda (Línies)
CREATE TABLE sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    qty INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    line_total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB;


-- ==========================================================
-- 📊 INSERCIÓ OBLIGATÒRIA DE MÉS DE 25 REGISTRES (RÚBRICA)
-- ==========================================================

-- A) Inserció de 26 Clients (Joan Puig manté moltes compres per a ser el VIP del filtre)
INSERT INTO customers (id, name, email, phone) VALUES
(1, 'Joan Puig', 'joan.puig@email.com', '600112233'),
(2, 'Marta Gómez', 'marta.gomez@email.com', '611223344'),
(3, 'Albert Roca', 'albert.roca@email.com', '622334455'),
(4, 'Laura Soler', 'laura.soler@email.com', '633445566'),
(5, 'Carlos Martínez', 'carlos.mtz@email.com', '644556677'),
(6, 'Ana Vila', 'ana.vila@email.com', '655667788'),
(7, 'David Lopez', 'david.lopez@email.com', '666778899'),
(8, 'Elena Gual', 'elena.gual@email.com', '677889900'),
(9, 'Jordi Sànchez', 'jordi.san@email.com', '688990011'),
(10, 'Sílvia Bosch', 'silvia.bosch@email.com', '699001122'),
(11, 'Marc Torres', 'marc.torres@email.com', '600998877'),
(12, 'Patricia Ortiz', 'patricia.o@email.com', '611887766'),
(13, 'Sergi Ramos', 'sergi.ramos@email.com', '622776655'),
(14, 'Clara Vidal', 'clara.vidal@email.com', '633665544'),
(15, 'Raul Peña', 'raul.pena@email.com', '644554433'),
(16, 'Nuria Flores', 'nuria.flores@email.com', '655443322'),
(17, 'Antoni Serra', 'antoni.serra@email.com', '666332211'),
(18, 'Gemma Ruiz', 'gemma.ruiz@email.com', '677221100'),
(19, 'Oriol Pou', 'oriol.pou@email.com', '688110099'),
(20, 'Mireia Comas', 'mireia.comas@email.com', '699009988'),
(21, 'Francesc Pi', 'francesc.pi@email.com', '601234567'),
(22, 'Rosa Blasi', 'rosa.blasi@email.com', '612345678'),
(23, 'Xavier Mas', 'xavier.mas@email.com', '623456789'),
(24, 'Imma Costa', 'imma.costa@email.com', '634567890'),
(25, 'Lluís Font', 'lluis.font@email.com', '645678901'),
(26, 'Carme Oleo', 'carme.oleo@email.com', '656789012');

-- B) Inserció de 27 Productes (Garantitza pàgines 0, 1 i 2 a la llista de productes)
INSERT INTO products (id, name, category, price, stock, active) VALUES
(1, 'Teclat Mecànic RGB', 'Perifèrics', 59.99, 4, 1),
(2, 'Ratolí Inalàmbric', 'Perifèrics', 29.99, 12, 1),
(3, 'Monitor 24" FullHD', 'Pantalles', 149.50, 25, 1),
(4, 'Auriculars Gaming', 'Àudio', 45.00, 3, 1),
(5, 'Alfombra XXL', 'Accessoris', 15.99, 50, 1),
(6, 'Cable HDMI 2m', 'Cables', 8.50, 8, 1),
(7, 'Hub USB-C 4 ports', 'Accessoris', 22.00, 19, 1),
(8, 'Suport Monitor', 'Oficina', 34.90, 2, 1),
(9, 'Disc Dur Extern 1TB', 'Emmagatzematge', 65.00, 15, 1),
(10, 'Memòria RAM 16GB', 'Components', 89.99, 30, 1),
(11, 'Targeta Gràfica RTX', 'Components', 429.00, 5, 1),
(12, 'Processador i7 Intel', 'Components', 299.00, 14, 1),
(13, 'Font Alimentació 750W', 'Components', 79.50, 22, 1),
(14, 'Caixa ATX Gaming', 'Components', 68.00, 9, 1),
(15, 'Ventilador CPU', 'Components', 35.00, 18, 1),
(16, 'Disc SSD 500GB', 'Emmagatzematge', 49.99, 40, 1),
(17, 'Cadira Ergonòmica', 'Oficina', 189.00, 6, 1),
(18, 'Escriptori Elevable', 'Oficina', 245.00, 3, 1),
(19, 'Webcam 1080p Ultra', 'Perifèrics', 42.50, 16, 1),
(20, 'Micròfon de Estudi', 'Àudio', 85.00, 11, 1),
(21, 'Altaveus 2.1 Bluetooth', 'Àudio', 55.00, 13, 1),
(22, 'Cable DisplayPort 1.4', 'Cables', 12.90, 35, 1),
(23, 'Regleta Intel·ligent', 'Accessoris', 19.99, 21, 1),
(24, 'Pasta Tèrmica Premium', 'Components', 7.50, 100, 1),
(25, 'Pendrive 64GB USB 3.0', 'Emmagatzematge', 9.99, 62, 1),
(26, 'Llum LED del escriptori', 'Oficina', 26.00, 1, 1),
(27, 'Netejador de Pantalles', 'Accessoris', 5.50, 15, 1);

-- C) Inserció de 26 Vendes històriques (Joan Puig té 6 compres per saltar el filtre VIP correctament)
INSERT INTO sales (id, customer_id, sale_date, payment_method, total) VALUES
(1, 1, '2026-05-01 10:00:00', 'Targeta', 89.98),
(2, 1, '2026-05-02 14:30:00', 'PayPal', 149.50),
(3, 1, '2026-05-03 09:15:00', 'Targeta', 15.99),
(4, 2, '2026-05-04 18:20:00', 'Efectiu', 75.00),
(5, 1, '2026-05-05 11:00:00', 'Targeta', 59.99),
(6, 3, '2026-05-06 12:00:00', 'PayPal', 239.49),
(7, 1, '2026-05-07 15:22:00', 'Targeta', 8.50),
(8, 4, '2026-05-08 16:40:00', 'Targeta', 45.00),
(9, 5, '2026-05-09 10:10:00', 'Efectiu', 189.00),
(10, 6, '2026-05-10 11:30:00', 'PayPal', 42.50),
(11, 7, '2026-05-11 12:15:00', 'Targeta', 68.00),
(12, 8, '2026-05-12 17:05:00', 'Targeta', 79.50),
(13, 9, '2026-05-13 19:45:00', 'Efectiu', 299.00),
(14, 10, '2026-05-14 09:00:00', 'PayPal', 55.00),
(15, 11, '2026-05-15 13:12:00', 'Targeta', 19.99),
(16, 12, '2026-05-15 14:50:00', 'Targeta', 9.99),
(17, 13, '2026-05-16 11:22:00', 'PayPal', 49.99),
(18, 14, '2026-05-16 16:15:00', 'Efectiu', 12.90),
(19, 15, '2026-05-17 10:05:00', 'Targeta', 35.00),
(20, 16, '2026-05-17 18:30:00', 'Targeta', 26.00),
(21, 17, '2026-05-18 12:40:00', 'PayPal', 7.50),
(22, 18, '2026-05-18 15:10:00', 'Targeta', 5.50),
(23, 19, '2026-05-18 20:02:00', 'Efectiu', 42.50),
(24, 20, '2026-05-19 09:45:00', 'Targeta', 149.50),
(25, 1, CURDATE(), 'Targeta', 34.90),                       -- Compra d'avui (KPI)
(26, 21, CURDATE(), 'PayPal', 429.00);                      -- Compra d'avui (KPI)

-- D) Detall dels articles de cada venda
INSERT INTO sale_items (sale_id, product_id, qty, unit_price, line_total) VALUES
(1, 2, 1, 29.99, 29.99), (1, 1, 1, 59.99, 59.99),
(2, 3, 1, 149.50, 149.50),
(3, 5, 1, 15.99, 15.99),
(4, 4, 1, 45.00, 45.00), (4, 6, 2, 8.50, 17.00),
(5, 1, 1, 59.99, 59.99),
(6, 3, 1, 149.50, 149.50), (6, 10, 1, 89.99, 89.99),
(7, 6, 1, 8.50, 8.50), (8, 4, 1, 45.00, 45.00),
(9, 17, 1, 189.00, 189.00), (10, 19, 1, 42.50, 42.50),
(11, 14, 1, 68.00, 68.00), (12, 13, 1, 79.50, 79.50),
(13, 12, 1, 299.00, 299.00), (14, 21, 1, 55.00, 55.00),
(15, 23, 1, 19.99, 19.99), (16, 25, 1, 9.99, 9.99),
(17, 16, 1, 49.99, 49.99), (18, 22, 1, 12.90, 12.90),
(19, 15, 1, 35.00, 35.00), (20, 26, 1, 26.00, 26.00),
(21, 24, 1, 7.50, 7.50), (22, 27, 1, 5.50, 5.50),
(23, 19, 1, 42.50, 42.50), (24, 3, 1, 149.50, 149.50),
(25, 8, 1, 34.90, 34.90), (26, 11, 1, 429.00, 429.00);