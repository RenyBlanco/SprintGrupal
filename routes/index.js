const express = require("express");
const rutas = express.Router();
const path = require('path');
const fs = require('fs');

function existeValor(obj,key){
    return key in obj;
}

function calculaPuntos(arr) {
    let puntos = [];
    for (let index = 0; index < arr.length; index++) {
        existeValor(arr[index], 'puntos') ? puntos[index] = arr[index].puntos : 0;
        existeValor(arr[index], 'fecha2') ? puntos[index] += arr[index].fecha2 : 0;
        existeValor(arr[index], 'fecha3') ? puntos[index] += arr[index].fecha3 : 0;
        existeValor(arr[index], 'fecha4') ? puntos[index] += arr[index].fecha4 : 0;
        existeValor(arr[index], 'fecha5') ? puntos[index] += arr[index].fecha5 : 0;
        existeValor(arr[index], 'fecha6') ? puntos[index] += arr[index].fecha6 : 0;
        existeValor(arr[index], 'fecha7') ? puntos[index] += arr[index].fecha7 : 0;
        existeValor(arr[index], 'fecha8') ? puntos[index] += arr[index].fecha8 : 0;
        existeValor(arr[index], 'fecha9') ? puntos[index] += arr[index].fecha9 : 0;
        existeValor(arr[index], 'fecha10') ? puntos[index] += arr[index].fecha10 : 0;
        existeValor(arr[index], 'fecha11') ? puntos[index] += arr[index].fecha11 : 0;
        existeValor(arr[index], 'fecha12') ? puntos[index] += arr[index].fecha12 : 0;
        existeValor(arr[index], 'fecha13') ? puntos[index] += arr[index].fecha13 : 0;
        existeValor(arr[index], 'fecha14') ? puntos[index] += arr[index].fecha14 : 0;
        existeValor(arr[index], 'fecha15') ? puntos[index] += arr[index].fecha15 : 0;
        existeValor(arr[index], 'fecha16') ? puntos[index] += arr[index].fecha16 : 0;
        existeValor(arr[index], 'fecha17') ? puntos[index] += arr[index].fecha17 : 0;
        existeValor(arr[index], 'fecha18') ? puntos[index] += arr[index].fecha18 : 0;
        existeValor(arr[index], 'fecha19') ? puntos[index] += arr[index].fecha19 : 0;
        existeValor(arr[index], 'fecha20') ? puntos[index] += arr[index].fecha20 : 0;
        existeValor(arr[index], 'fecha21') ? puntos[index] += arr[index].fecha21 : 0;
        existeValor(arr[index], 'fecha22') ? puntos[index] += arr[index].fecha22 : 0;
        existeValor(arr[index], 'fecha23') ? puntos[index] += arr[index].fecha23 : 0;
        arr[index].total = puntos[index];
    }
    return arr;
}

rutas.get('/', (req,res) => {
    res.render('home');
});

rutas.get('/escuderia', (req,res) => {
    
    const filePath = req.flash('publicDir')[0];
    let result = path.join(filePath,'resultados.json');
    const valores = JSON.parse(fs.readFileSync(result));
    
    let arreglo = calculaPuntos(valores);

    const unique = arreglo.reduce((p,c)=>{
        let idx = p[0].indexOf(c.escuderia);
        if(idx > -1){
            p[1][idx].total += c.total;
        }else{
            p[0].push(c.escuderia)
            p[1].push(c)
        }
        return p
    },[[],[]]);

    const datos = unique[1]
    for (let index = 0; index < datos.length; index++) {
        datos[index].ranking = index +1;
    }

    res.render('escuderia',{datos});
});

rutas.get('/pilotos', (req,res) => {
    let valCarrera = [];
    let drivers = [];
    
    const filePath = req.flash('publicDir')[0];
    let carreras = path.join(filePath,'circuitos.json');
    let result = path.join(filePath,'resultados.json');
    const resultados = JSON.parse(fs.readFileSync(result));
    const valores = JSON.parse(fs.readFileSync(carreras));

    let arreglo = calculaPuntos(resultados);

    for (let index = 0; index < valores.carrera.length; index++) {
        let mientras = valores.carrera[index].resultados
        if(mientras !== undefined) {
            for (let idx = 0; idx < mientras.length; idx++) {
                drivers[idx] = {
                    'piloto' : mientras[idx].piloto,
                    'abandonos' :0,
                    'total' : 0
                }
            }
        }
    }

    for (let index = 0; index < drivers.length; index++) {
        let contador = 0;
        for (let jdx = 0; jdx < valores.carrera.length; jdx++) {
            let mientras = valores.carrera[jdx].resultados
            if(mientras !== undefined) {
                for (let idx = 0; idx < mientras.length; idx++) {
                    if(mientras[idx].piloto == drivers[index].piloto && mientras[idx].abandono === "Si") {
                        contador++;
                    }
                }
            }
        }
        drivers[index].abandonos = contador;
        drivers[index].total = arreglo[index].total;
    }

    
    
    drivers.sort((a, b) => {
        return b.total- a.total;
    });
    

    res.render('pilotos', {drivers});
});

module.exports = rutas;