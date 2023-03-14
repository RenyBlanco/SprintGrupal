const express = require("express");
const fs = require('fs');
const rutas = express.Router();
const path = require('path');

function calcPtos(valor) {
    let ptos = 0;
    switch (valor) {
        case 1:
            ptos = 25
            break;
        case 2:
            ptos = 18
            break;
        case 3:
            ptos = 16
            break;
        case 4:
            ptos = 12
            break;
        case 5:
            ptos = 10
            break;
        case 6:
            ptos = 8
            break;
        case 7:
            ptos = 6
            break;
        case 8:
            ptos = 4
            break;
        case 9:
            ptos = 2
            break;
        case 10:
            ptos = 1
            break;
        default:
            ptos = 0
            break;
    }
    return ptos;
}

rutas.get('/', (req, res) => {
    const filePath = req.flash('publicDir')[0];
    let circuitos = path.join(filePath,'circuitos.json');
    const valores = JSON.parse(fs.readFileSync(circuitos));
    res.render('carreras/lista', {valores});
});

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
    const carreras = path.join(filePath, 'circuitos.json');
    let resultados = [];
    let valCarrera = JSON.parse(fs.readFileSync(carreras));
    let ptos = 0;

    let indice = valCarrera.carrera.map(circuito => circuito.circuito).indexOf(circuito);
    
    const escuderia  = req.body.escuderia;
    const piloto  = req.body.pilotos;
    const minutos  = req.body.minutos;
    const ubicacion = req.body.ubicacion;
    const abandona = req.body.abandona;
    const razon = req.body.razon;
    
    for (let index = 0; index < escuderia.length; index++) {

        let puntos = calcPtos(parseInt(ubicacion[index]));
        
        const nuevo = {
            "escuderia": escuderia[index],
            "piloto": piloto[index],
            "tiempo": parseFloat(minutos[index]),
            "posicion": ubicacion[index],
            "abandono" : abandona[index],
            "razon" : razon[index],
            "puntos" : puntos
        };
        resultados.push(nuevo);
    }
        
    if(indice >=0){
        valCarrera.carrera[indice].resultados = resultados ;
        fs.writeFileSync(carreras, JSON.stringify(valCarrera));
        req.flash('exito', 'Resultado agregado con éxito');
    }else{
        req.flash('message', 'No se pudo agregar el resultado');
    }
    
    res.redirect('/carreras');
});

rutas.get('/ver/:circuito', (req, res) => { 
    let circuito = req.params.circuito;
    let valCarrera = [];
    const filePath = req.flash('publicDir')[0];
    let carreras = path.join(filePath,'circuitos.json');
    const valores = JSON.parse(fs.readFileSync(carreras));

    let indice = valores.carrera.map(circuito => circuito.circuito).indexOf(circuito);
    if(indice >=0){
        valCarrera = valores.carrera[indice].resultados;
        valCarrera.sort((a, b) => {
            return b.puntos- a.puntos;
         });
    }else{
        req.flash('message', 'No se conseguió el resultado');
    }
    res.render('carreras/ver', {valCarrera, circuito});
});

rutas.get('/resultados', (req, res) => { 
    let valCarrera = [];
    let aja = 0;
    const filePath = req.flash('publicDir')[0];
    let carreras = path.join(filePath,'circuitos.json');
    let result = path.join(filePath,'resultados.json');
    const valores = JSON.parse(fs.readFileSync(carreras));

    for (let index = 0; index < valores.carrera.length; index++) {
        aja++;
        let fecha = "fecha"+aja;
        let mientras = valores.carrera[index].resultados
        if(mientras !== undefined) {
            if(index === 0) {
                valCarrera = valores.carrera[index].resultados;
            }else{
                let otra = valores.carrera[index].resultados;
                if(otra !== undefined) {
                    for (let idx = 0; idx < otra.length; idx++) {
                        valCarrera[idx][fecha] = otra[idx].puntos;
                    }
                }
            }
        }
    }
    fs.writeFileSync(result, JSON.stringify(valCarrera));
    // valCarrera.sort((a, b) => {
    //     return b.puntos- a.puntos;
    // });
    res.render('carreras/resultados', {valCarrera});
});

rutas.get('/editar/:circuito', (req, res) => {
    let circuito = req.params.circuito;
    let valCarrera = [];
    const filePath = req.flash('publicDir')[0];
    let carreras = path.join(filePath,'circuitos.json');
    const valores = JSON.parse(fs.readFileSync(carreras));

    let indice = valores.carrera.map(circuito => circuito.circuito).indexOf(circuito);
    if(indice >=0){
        valCarrera = valores.carrera[indice].resultados;
        valCarrera.sort((a, b) => {
            return b.puntos- a.puntos;
         });
    }else{
        req.flash('message', 'No se conseguió el resultado');
    }
    res.render('carreras/editar', {valCarrera, circuito});
});

rutas.post('/editar/:circuito', (req, res) => {
    let circuito = req.params.circuito;
    const filePath = req.flash('publicDir')[0];
    const carreras = path.join(filePath, 'circuitos.json');
    let resultados = [];
    let valCarrera = JSON.parse(fs.readFileSync(carreras));

    let indice = valCarrera.carrera.map(circuito => circuito.circuito).indexOf(circuito);
    
    const escuderia  = req.body.escuderia;
    const piloto  = req.body.pilotos;
    const minutos  = req.body.minutos;
    const ubicacion = req.body.ubicacion;
    const abandona = req.body.abandona;
    const razon = req.body.razon;
    
    for (let index = 0; index < escuderia.length; index++) {

        let puntos = calcPtos(parseInt(ubicacion[index]));
        
        const nuevo = {
            "escuderia": escuderia[index],
            "piloto": piloto[index],
            "tiempo": parseFloat(minutos[index]),
            "posicion": ubicacion[index],
            "abandono" : abandona[index],
            "razon" : razon[index],
            "puntos" : puntos
        };
        resultados.push(nuevo);
    }
        
    if(indice >=0){
        valCarrera.carrera[indice].resultados = resultados ;
        fs.writeFileSync(carreras, JSON.stringify(valCarrera));
        req.flash('exito', 'Resultado actualizado con éxito');
    }else{
        req.flash('message', 'No se pudo agregar el resultado');
    }
    
    res.redirect('/carreras');
});


module.exports = rutas;