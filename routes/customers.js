const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Listado de clientes
router.get('/', async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 0;
        const cerca = req.query.cerca || '';
        const vip = req.query.vip === 'true'; 
        const offset = pagina * 10;

        let query = `
            SELECT c.*, COUNT(s.id) as compres, IFNULL(SUM(s.total), 0) as total_gastat
            FROM customers c
            LEFT JOIN sales s ON c.id = s.customer_id
            WHERE (c.name LIKE ? OR c.email LIKE ?)
        `;
        let params = [`%${cerca}%`, `%${cerca}%`];

        if (vip) {
            query += " GROUP BY c.id HAVING compres >= 5"; // Simulación de VIP por +5 compras
        } else {
            query += " GROUP BY c.id";
        }

        query += " LIMIT 10 OFFSET ?";
        params.push(offset);

        const [rows] = await db.query(query, params);

        res.render('customers/llistat', { 
            customers: rows, pagina, cerca, vip, title: 'Clients' 
        });
    } catch (e) { res.status(500).send(e.message); }
});

// Renderizar Añadir Client
router.get('/clientAfegir', (req, res) => {
    res.render('customers/afegir', { title: 'Afegir Client' });
});

// Renderizar Editar Client
router.get('/clientEditar', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM customers WHERE id = ?", [req.query.id]);
        if (rows.length === 0) return res.redirect('/clients');
        res.render('customers/editar', { customer: rows[0], title: 'Editar Client' });
    } catch (e) { res.status(500).send(e.message); }
});

// Ficha de Cliente
router.get('/clientFitxa', async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.redirect('/clients');

        const [customer] = await db.query("SELECT * FROM customers WHERE id = ?", [id]);
        if (customer.length === 0) return res.redirect('/clients');

        const [sales] = await db.query("SELECT * FROM sales WHERE customer_id = ? ORDER BY sale_date DESC LIMIT 10", [id]);
        const [stats] = await db.query("SELECT SUM(total) as total_gastat, AVG(total) as ticket_mig FROM sales WHERE customer_id = ?", [id]);

        res.render('customers/fitxa', {
            customer: customer[0],
            sales,
            stats: {
                total_gastat: stats[0].total_gastat || 0,
                ticket_mig: stats[0].ticket_mig ? parseFloat(stats[0].ticket_mig).toFixed(2) : 0
            },
            title: 'Fitxa Client'
        });
    } catch (e) { res.status(500).send(e.message); }
});

// CRUD: Crear
router.post('/create', async (req, res) => {
    try {
        if (req.body.taula === 'clients') {
            const { name, email, phone } = req.body;
            await db.query("INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)", [name, email, phone]);
        }
        res.redirect('/clients');
    } catch (e) { res.status(500).send(e.message); }
});

// CRUD: Editar
router.post('/Update', async (req, res) => {
    try {
        if (req.body.taula === 'clients') {
            const { id, name, email, phone } = req.body;
            await db.query("UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?", [name, email, phone, id]);
        }
        res.redirect('/clients');
    } catch (e) { res.status(500).send(e.message); }
});

// CRUD: Eliminar
router.post('/Delete', async (req, res) => {
    try {
        await db.query("DELETE FROM customers WHERE id = ?", [req.body.id]);
        res.redirect('/clients');
    } catch (e) { res.status(500).send("No es pot eliminar el client, té historial de compres."); }
});

module.exports = router;