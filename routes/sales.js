const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Listado de Ventas
router.get('/', async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 0;
        const cerca = req.query.cerca || '';
        const offset = pagina * 10;

        const [rows] = await db.query(
            `SELECT s.*, c.name as customer_name 
             FROM sales s 
             JOIN customers c ON s.customer_id = c.id 
             WHERE c.name LIKE ? 
             ORDER BY s.sale_date DESC 
             LIMIT 10 OFFSET ?`, 
            [`%${cerca}%`, offset]
        );

        res.render('sales/llistat', { sales: rows, pagina, cerca, title: 'Vendes' });
    } catch (e) { res.status(500).send(e.message); }
});

// Detalle de la venta
router.get('/detall', async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.redirect('/vendes');

        const [sale] = await db.query(
            `SELECT s.*, c.name as customer_name, c.email as customer_email 
             FROM sales s 
             JOIN customers c ON s.customer_id = c.id 
             WHERE s.id = ?`, [id]
        );

        if (sale.length === 0) return res.redirect('/vendes');

        const [items] = await db.query(
            `SELECT si.*, p.name as product_name 
             FROM sale_items si 
             JOIN products p ON si.product_id = p.id 
             WHERE si.sale_id = ?`, [id]
        );

        res.render('sales/detall', { sale: sale[0], items, title: 'Detall de Venda' });
    } catch (e) { res.status(500).send(e.message); }
});

module.exports = router;