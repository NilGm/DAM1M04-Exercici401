const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Listado de Productos
router.get('/', async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 0;
        const cerca = req.query.cerca || '';
        const offset = pagina * 10;
        
        const [rows] = await db.query(
            "SELECT * FROM products WHERE name LIKE ? OR category LIKE ? LIMIT 10 OFFSET ?", 
            [`%${cerca}%`, `%${cerca}%`, offset]
        );
        
        res.render('products/llistat', { products: rows, pagina, cerca, title: 'Productes' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Renderizar formulario de agregar producto
router.get('/producteAfegir', (req, res) => {
    res.render('products/afegir', { title: 'Afegir Producte' });
});

// Renderizar formulario de editar producto
router.get('/producteEditar', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.query.id]);
        if (rows.length === 0) return res.redirect('/productes');
        res.render('products/editar', { product: rows[0], title: 'Editar Producte' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// CRUD: Crear
router.post('/create', async (req, res) => {
    try {
        if (req.body.taula === 'productes') {
            const { name, category, price, stock, active } = req.body;
            await db.query("INSERT INTO products (name, category, price, stock, active) VALUES (?,?,?,?,?)", 
            [name, category, price, stock, active === 'on' ? 1 : 0]);
        }
        res.redirect('/productes');
    } catch (e) { res.status(500).send(e.message); }
});

// CRUD: Editar
router.post('/Update', async (req, res) => {
    try {
        const { id, name, category, price, stock, active } = req.body;
        await db.query("UPDATE products SET name=?, category=?, price=?, stock=?, active=? WHERE id=?", 
        [name, category, price, stock, active === 'on' ? 1 : 0, id]);
        res.redirect('/productes');
    } catch (e) { res.status(500).send(e.message); }
});

// CRUD: Eliminar
router.post('/Delete', async (req, res) => {
    try {
        await db.query("DELETE FROM products WHERE id=?", [req.body.id]);
        res.redirect('/productes');
    } catch (e) { res.status(500).send("No es pot eliminar el producte, està vinculat a una venda."); }
});

module.exports = router;