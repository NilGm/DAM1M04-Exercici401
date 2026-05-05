const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', async (req, res) => {
    const pagina = parseInt(req.query.pagina) || 0;
    const cerca = req.query.cerca || '';
    const offset = pagina * 10;
    const [rows] = await db.query("SELECT * FROM products WHERE name LIKE ? LIMIT 10 OFFSET ?", [`%${cerca}%`, offset]);
    res.render('products/llistat', { products: rows, pagina, cerca });
});

router.post('/create', async (req, res) => {
    if (req.body.taula === 'products') {
        const { name, category, price, stock, active } = req.body;
        await db.query("INSERT INTO products (name, category, price, stock, active) VALUES (?,?,?,?,?)", 
        [name, category, price, stock, active === 'on' ? 1 : 0]);
    }
    res.redirect('/productes');
});

router.post('/Update', async (req, res) => {
    const { id, name, category, price, stock, active } = req.body;
    await db.query("UPDATE products SET name=?, category=?, price=?, stock=?, active=? WHERE id=?", 
    [name, category, price, stock, active === 'on' ? 1 : 0, id]);
    res.redirect('/productes');
});

router.post('/Delete', async (req, res) => {
    await db.query("DELETE FROM products WHERE id=?", [req.body.id]);
    res.redirect('/productes');
});

module.exports = router;