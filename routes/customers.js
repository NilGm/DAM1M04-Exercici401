const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// 1. LISTADO DE CLIENTES (/clients)
router.get('/', async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 0;
        const cerca = req.query.cerca || '';
        const vip = req.query.vip === 'true'; // Filtro VIP (true/false)
        const offset = pagina * 10;

        let query = "SELECT * FROM customers WHERE (name LIKE ? OR email LIKE ?)";
        let params = [`%${cerca}%`, `%${cerca}%`];

        // Si piden solo clientes VIP (asumiendo que consideramos VIP a los que tienen muchas compras, 
        // o si tienes un campo 'vip' en la base de datos. Aquí simularemos que es un filtro)
        if (vip) {
            // Ejemplo: VIP si están en un listado especial o si cumple una condición. 
            // Si añadiste el campo 'vip' a la tabla de la base de datos, descomenta la línea de abajo:
            // query += " AND is_vip = 1";
        }

        query += " LIMIT 10 OFFSET ?";
        params.push(offset);

        const [rows] = await db.query(query, params);

        res.render('customers/llistat', { 
            customers: rows, 
            pagina, 
            cerca, 
            vip,
            title: 'Clients' 
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// 2. FICHA DEL CLIENTE (/clientFitxa)
router.get('/clientFitxa', async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.redirect('/clients');

        // Obtener datos del cliente
        const [customer] = await db.query("SELECT * FROM customers WHERE id = ?", [id]);
        if (customer.length === 0) return res.redirect('/clients');

        // Obtener historial de las últimas 10 ventas
        const [sales] = await db.query(
            "SELECT * FROM sales WHERE customer_id = ? ORDER BY sale_date DESC LIMIT 10", 
            [id]
        );

        // Opcional: Total gastado y ticket medio
        const [stats] = await db.query(
            "SELECT SUM(total) as total_gastat, AVG(total) as ticket_mig FROM sales WHERE customer_id = ?", 
            [id]
        );

        res.render('customers/fitxa', {
            customer: customer[0],
            sales,
            stats: stats[0],
            title: 'Fitxa Client'
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// 3. CREAR CLIENTE (/create)
router.post('/create', async (req, res) => {
    try {
        if (req.body.taula === 'clients') {
            const { name, email, phone } = req.body;
            await db.query(
                "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)", 
                [name, email, phone]
            );
        }
        res.redirect('/clients');
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// 4. EDITAR CLIENTE (/Update)
router.post('/Update', async (req, res) => {
    try {
        if (req.body.taula === 'clients') {
            const { id, name, email, phone } = req.body;
            await db.query(
                "UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?", 
                [name, email, phone, id]
            );
        }
        res.redirect('/clients');
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// 5. ELIMINAR CLIENTE (/Delete)
router.post('/Delete', async (req, res) => {
    try {
        await db.query("DELETE FROM customers WHERE id = ?", [req.body.id]);
        res.redirect('/clients');
    } catch (e) {
        res.status(500).send("No es pot eliminar el client perquè té comandes associades a l'historial.");
    }
});

module.exports = router;