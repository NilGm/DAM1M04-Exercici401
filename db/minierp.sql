-- 1. Crear la base de datos si no existe y seleccionarla
CREATE DATABASE IF NOT EXISTS minierp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE minierp;

-- 2. Eliminar tablas previas en orden inverso por las claves foráneas (por si acaso)
DROP TABLE IF EXISTS sale_items;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

-- 3. Crear Tabla de Clientes
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

-- 4. Crear Tabla de Productos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- 5. Crear Tabla de Ventas (Cabecera del Ticket)
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50) NOT NULL,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. Crear Tabla de Detalles de Venta (Líneas del Ticket)
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
-- 🛠️ DATOS DE PRUEBA (Para probar filtros, paginación y KPIs)
-- ==========================================================

-- Insertar Clientes (Ponemos uno que será "VIP" con muchas compras)
INSERT INTO customers (id, name, email, phone) VALUES
(1, 'Joan Puig', 'joan.puig@email.com', '600112233'),
(2, 'Marta Gómez', 'marta.gomez@email.com', '611223344'),
(3, 'Albert Roca', 'albert.roca@email.com', '622334455'),
(4, 'Laura Soler', 'laura.soler@email.com', '633445566');

-- Insertar Productos (Con diferentes niveles de stock para probar el "semáforo")
INSERT INTO products (id, name, category, price, stock, active) VALUES
(1, 'Teclat Mecànic RGB', 'Perifèrics', 59.99, 4, 1),   -- Stock Crítico (Rojo)
(2, 'Ratolí Inalàmbric', 'Perifèrics', 29.99, 12, 1),   -- Stock Mitjà (Taronja)
(3, 'Monitor 24" FullHD', 'Pantalles', 149.50, 25, 1),  -- Stock Bo (Verd)
(4, 'Auriculars Gaming', 'Àudio', 45.00, 3, 1),         -- Stock Crítico (Rojo)
(5, 'Alfombra XXL', 'Accessoris', 15.99, 50, 1),
(6, 'Cable HDMI 2m', 'Cables', 8.50, 8, 1),
(7, 'Hub USB-C 4 ports', 'Accessoris', 22.00, 19, 1),
(8, 'Suport Monitor', 'Oficina', 34.90, 2, 1),          -- Stock Crítico (Rojo)
(9, 'Disc Dur Extern 1TB', 'Emmagatzematge', 65.00, 15, 1),
(10, 'Memòria RAM 16GB', 'Components', 89.99, 30, 1),
(11, 'Targeta Gràfica RTX', 'Components', 429.00, 5, 1); -- Para probar la paginación (>10 productos)

-- Insertar Historial de Ventas (Para los KPIs del Dashboard y Filtro VIP)
-- Le creamos 5 ventas a Joan Puig (ID 1) para que se convierta en VIP en tu buscador
INSERT INTO sales (id, customer_id, sale_date, payment_method, total) VALUES
(1, 1, '2026-05-10 10:00:00', 'Targeta', 89.98),
(2, 1, '2026-05-12 14:30:00', 'PayPal', 149.50),
(3, 1, '2026-05-15 09:15:00', 'Targeta', 15.99),
(4, 2, '2026-05-18 18:20:00', 'Efectiu', 75.00),
(5, 1, CURDATE(), 'Targeta', 59.99),                     -- Venda d'Avui para el KPI
(6, 3, CURDATE(), 'PayPal', 239.49),                    -- Venda d'Avui para el KPI
(7, 1, '2026-05-19 11:00:00', 'Targeta', 8.50);

-- Insertar los artículos dentro de cada una de esas ventas
INSERT INTO sale_items (sale_id, product_id, qty, unit_price, line_total) VALUES
(1, 2, 1, 29.99, 29.99), -- Venda 1: 1 ratolí y 1 teclat
(1, 1, 1, 59.99, 59.99),
(2, 3, 1, 149.50, 149.50), -- Venda 2: 1 Monitor
(3, 5, 1, 15.99, 15.99),  -- Venda 3: 1 Alfombra
(4, 4, 1, 45.00, 45.00),  -- Venda 4: Auriculars i cable
(4, 6, 2, 8.50, 17.00),
(5, 1, 1, 59.99, 59.99),  -- Venda 5: Teclat
(6, 3, 1, 149.50, 149.50), -- Venda 6: Monitor y RAM
(6, 10, 1, 89.99, 89.99),
(7, 6, 1, 8.50, 8.50);    -- Venda 7: Cable