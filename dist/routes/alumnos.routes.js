"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const alumnos_controller_1 = require("../controllers/alumnos.controller");
const router = (0, express_1.Router)();

// Ruta principal de alumnos
router.get('/clases/:matricula', (req, res) => {
    res.send('Ruta de alumnos funcionando');
});

// Ruta POST para pasar lista
router.post('/lista', alumnos_controller_1.postPasarLista);

exports.default = router;
