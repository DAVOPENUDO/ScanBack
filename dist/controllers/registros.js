"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAlumno = exports.postProfesor = exports.raiz = void 0;
const conect_1 = __importDefault(require("../db/conect"));
const raiz = (req, res) => {
    res.json({ msj: 'Ruta para realizar registros' });
};
exports.raiz = raiz;
const postProfesor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const {  matricula, nombre, apellidoPa, apellidoMa, password } = req.body;
    conect_1.default.query("INSERT INTO profesores VALUES (?,?,?,?,?);", [matricula.trim(), nombre.trim(), apellidoPa.trim(), apellidoMa.trim(), password.trim()], (err, result) => {
        if (err) {
            res.json({ msj: 'Error al registrar al profesores', "status": false });
        }
        else {
            res.json({ msj: 'Se ha registrado correctamente el Profesor ' + nombre, "status": true });
        }
    });
});
exports.postProfesor = postProfesor;
const postAlumno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { matricula, nombre, apellidoPa, apellidoMa, grupo, password } = req.body;
    conect_1.default.query("INSERT INTO alumnos VALUES (?,?,?,?,?,?);", [matricula.trim(), nombre.trim(), apellidoPa.trim(), apellidoMa.trim(), grupo.trim(), password.trim()], (err, result) => {
        if (err) {
            res.json({ msj: 'Error al registrar al alumno', "status": false });
        }
        else {
            res.json({ msj: 'Se ha registrado correctamente el Alumno ' + nombre, "status": true });
        }
    });
});
exports.postAlumno = postAlumno;
//# sourceMappingURL=registros.js.map