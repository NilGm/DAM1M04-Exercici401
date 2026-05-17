const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// 1. LISTADO DE VENTAS (/vendes)
router.get('/', async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 0;
        const cerca = req.query.cerca || '';
        const offset = pagina * 10;

        // Buscamos las ventas haciendo un JOIN con clientes para poder filtrar por el nombre del cliente
        const [rows] = await db.query(
            `SELECT s.*, c.name as customer_name 
             FROM sales s 
             JOIN customers c ON s.customer_id = c.id 
             WHERE c.name LIKE ? 
             ORDER BY s.sale_date DESC 
             LIMIT 10 OFFSET ?`, 
            [`%${cerca}%`, offset]
        );

        res.render('sales/llistat', { 
            sales: rows, 
            pagina, 
            cerca, 
            title: 'Vendes' 
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// 2. DETALLE DE UNA VENDA / VER TICKET (Opcional pero muy recomendado para la columna 'accions')
router.get('/detall', async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.redirect('/vendes');

        // Datos principales de la venta y el cliente
        const [sale] = await db.query(
            `SELECT s.*, c.name as customer_name, c.email as customer_email 
             FROM sales s 
             JOIN customers c ON s.customer_id = c.id 
             WHERE s.id = ?`, 
            [id]
        );

        if (sale.length === 0) return res.redirect('/vendes');

        // Líneas de artículos de la venta
        const [items] = await db.query(
            `SELECT si.*, p.name as product_name 
             FROM sale_items si 
             JOIN products p ON si.product_id = p.id 
             WHERE si.sale_id = ?`, 
            [id]
        );

        res.render('sales/detall', {
            sale: sale[0],
            items,
            title: 'Detall de Venda'
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// 3. CREAR VENDA (Lógica del proceso de venta + Control de Stock)
router.post('/create', async (req, res) => {
    // Nota: Para una venta real con múltiples líneas de producto (sale_items), 
    // se suele enviar un JSON o procesar arrays de inputs. 
    // Aquí tienes la estructura base para recibir los datos de la venta.
    try {
        if (req.body.taula === 'vendes') {
            const { customer_id, payment_method, total, items } = req.body; 
            // 'items' debería ser un array de objetos [{product_id, qty, unit_price}]

            // 1. Insertar en la tabla 'sales'
            const [result] = await db.query(
                "INSERT INTO sales (customer_id, sale_date, payment_method, total) VALUES (?, NOW(), ?, ?)",
                [customer_id, payment_method, total]
            );
            
            const saleId = result.insertId;

            // 2. Si el formulario envía los ítems, los guardamos y restamos el stock
            if (items && Array.isArray(items)) {
                for (const item of items) {
                    const line_total = item.qty * item.unit_price;
                    
                    // Insertar línea de venta
                    await db.query(
                        "INSERT INTO sale_items (sale_id, product_id, qty, unit_price, line_total) VALUES (?, ?, ?, ?, ?)",
                        [saleId, item.product_id, item.qty, item.unit_price, line_total]
                    );

                    // Restar del Stock del producto (Control de stock requerido)
                    await db.query(
                        "UPDATE products SET stock = stock - ? WHERE id = ?",
                        [item.qty, item.product_id]
                    );
                }
            }
        }
        res.redirect('/vendes');
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;