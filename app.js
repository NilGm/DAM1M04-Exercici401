const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const app = express();

// Helpers de Handlebars per a la lògica de vistes
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        eq: (a, b) => a === b,
        formatDate: (date) => new Date(date).toLocaleDateString(),
        calculateStockClass: (stock) => {
            if (stock <= 5) return 'red';
            if (stock <= 15) return 'orange';
            return 'green';
        }
    }
}));
app.set('view engine', 'hbs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutes
app.use('/', require('./routes/dashboard'));
app.use('/productes', require('./routes/products'));
app.use('/clients', require('./routes/customers'));
app.use('/vendes', require('./routes/sales'));

app.listen(3000, () => console.log('Servidor ERP a http://localhost:3000'));