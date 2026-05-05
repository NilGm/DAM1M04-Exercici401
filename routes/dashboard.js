const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', async (req, res) => {
    try {
        const [v_avui] = await db.query("SELECT SUM(total) as t FROM sales WHERE DATE(sale_date) = CURDATE()");
        const [v_mes] = await db.query("SELECT SUM(total) as t FROM sales WHERE MONTH(sale_date) = MONTH(CURDATE())");
        const [stockBaix] = await db.query("SELECT COUNT(*) as total FROM products WHERE stock <= 5");
        const [last5] = await db.query("SELECT s.*, c.name FROM sales s JOIN customers c ON s.customer_id = c.id ORDER BY s.sale_date DESC LIMIT 5");
        const [top5] = await db.query("SELECT p.name, SUM(si.qty) as total FROM sale_items si JOIN products p ON si.product_id = p.id GROUP BY p.id ORDER BY total DESC LIMIT 5");

        res.render('dashboard', { 
            kpis: { avui: v_avui[0].t || 0, mes: v_mes[0].t || 0, stock: stockBaix[0].total },
            last5, top5, title: 'Dashboard'
        });
    } catch (e) { res.status(500).send(e.message); }
});

module.exports = router;