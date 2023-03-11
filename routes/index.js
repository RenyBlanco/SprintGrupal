const express = require("express");
const rutas = express.Router();

rutas.get('/', (req,res) => {
    res.render('home');
});

rutas.get('/escuderia', (req,res) => {
    res.render('escuderia');
});

rutas.get('/pilotos', (req,res) => {
    res.render('pilotos');
});

module.exports = rutas;