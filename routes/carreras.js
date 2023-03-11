const express = require("express");
const fs = require('fs');
const rutas = express.Router();
const path = require('path');

rutas.get('/add/:circuito', (req, res) => {
    let circuito = req.params.circuito;
    const filePath = req.flash('publicDir')[0];
    let teams = path.join(filePath,'equipos.json');
    const valores = JSON.parse(fs.readFileSync(teams));
    res.render('carreras/add', {valores, circuito});
});

rutas.post('/add/:circuito', (req, res) => {
    let circuito = req.params.circuito;
    const filePath = req.flash('publicDir')[0];
    let teams = path.join(filePath,'equipos.json');
    let carreras = path.join(filePath, 'circuitos.json');
    let resulta = path.join(filePath, 'resultados.json');
    let mete = JSON.parse(fs.readFileSync(teams));
    let resultados = '';
    let valCarrera = JSON.parse(fs.readFileSync(carreras));
    let indice = valCarrera.carrera.map(circuito => circuito.circuito).indexOf(circuito);
    if(indice >=0){
        valCarrera.carrera[indice].resultados = mete ;
        resultados = valCarrera;
    }else{
        console.log('No se consigue...');
    }
   

    // const { piloto1, piloto2, minutos, ubica, abandona, radio } = req.body;

    // const nuevo = {
    //     "id": indice,
    //     "nombre": nombre,
    //     "precio": parseInt(precio)
    // };
    
    // idx.resultados.push(nuevo);
    
    fs.writeFileSync(resulta, JSON.stringify(resultados));
    req.flash('exito', 'Resultado agregado con éxito');
    res.redirect('/carreras');
});

rutas.get('/', (req, res) => {
    const filePath = req.flash('publicDir')[0];
    let circuitos = path.join(filePath,'circuitos.json');
    const valores = JSON.parse(fs.readFileSync(circuitos));
    res.render('carreras/lista', {valores});
});

rutas.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    let indice = parseInt(id)-1;
    let idx = JSON.parse(fs.readFileSync(filePath));
    idx.almuerzos.splice(indice,1);
    fs.writeFileSync(filePath, JSON.stringify(idx));
    req.flash('exito', 'Enlace borrado con éxito');
    res.redirect('/');
});

rutas.get('/editar/:id', (req, res) => {
    const { id } = req.params;
    let indice = parseInt(id)-1;
    let idx = JSON.parse(fs.readFileSync(filePath));
    const valores = idx.almuerzos[indice];
    res.render('carreras/editar', {valores});
});

rutas.post('/editar/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio } = req.body;
    const updated = {
        "id" : id,
        "nombre" : nombre,
        "precio" : parseInt(precio)
    };
    let idx = JSON.parse(fs.readFileSync(filePath));
    idx.almuerzos[id-1] = updated;
    fs.writeFileSync(filePath, JSON.stringify(idx));
    req.flash('exito', 'Enlace actualizado con éxito');
    res.redirect('/');
});

module.exports = rutas;