"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Profesor {
    constructor() { }
    ObtenerHorarioProfesor(db, matricula) {
        return new Promise((resolve, reject) => {
            const consulta = `SELECT c.idClase , p.matricula, p.nombre, c.nombre as 'clase', c.grado, c.grupo, h.horaInit, h.horaFin, h.salon,d.nombre as 'diasemana'
            FROM clases as c, profesor as p , horario as h, diasSemana as d 
            WHERE p.matricula=? and p.matricula=c.matriculaProfe and c.idClase=h.idClase and h.idDiaSemana=d.idDiaSemana`;
            db.query(consulta, [matricula], (err, results) => {
                if (err) {
                    reject({ msj: 'Error al obtener la consulta' });
                }
                else {
                    if (results.length > 0)
                        resolve({ clases: results });
                    else
                        reject({ msj: 'No hay clases registradas' });
                }
            });
        });
    }
    ObtenerHorarioHoy(db, matricula, dia) {
        return new Promise((resolve, reject) => {
            const consulta = `
            SELECT c.idClase , p.matricula, p.nombre, c.nombre as 'clase', c.grupo, h.horaInit , h.horaFin , h.salon, d.nombre as 'diassemana', h.idHorario  
            FROM clases as c 
            JOIN profesores as p ON p.matricula  = c.matriculaProfe 
            JOIN horario as h ON c.idClase  = h.idClase  
            JOIN diassemana as d ON h.idDiaSemana = d.idDiaSemana  
            WHERE p.matricula = ? AND d.nombre = ?`;
            
            db.query(consulta, [matricula, dia], (err, clases) => {
                if (err) {
                    reject({ msj: 'Error al obtener la consulta', error: err });
                } else {
                    if (clases.length > 0) {
                        resolve({ clases });
                    } else {
                        reject({ msj: 'No hay clases para el dia de hoy' });
                    }
                }
            });
        });
    }
    
    ObtenerHorarioClassId(db, idClase) {
        return new Promise((resolve, reject) => {
            const consulta = `SELECT c.idClase, h.idHorario,c.nombre as 'clase',  h.horaInit, h.horaFin, h.salon, d.nombre as 'diasemana', c.grupo 
            FROM horario as h, clases as c, diasSemana as d 
            WHERE h.idClase=c.idClase and h.idDiaSemana=d.idDiaSemana and c.idClase=?;`;
            db.query(consulta, [idClase], (err, horario) => {
                if (err) {
                    reject({ msj: 'Error al obtener el horario de la clase' });
                }
                else {
                    if (horario.length > 0) {
                        resolve({ horario, status: true });
                    }
                    else {
                        reject({ msj: `La clase no tiene ningun horario registrado`, status: false });
                    }
                }
            });
        });
    }

    ObtenerAlumnosAsistidos(db, codigo) {
        return new Promise((resolve, reject) => {
            const consulta = `
             SELECT la.matriculaAlum, a.nombre, a.apellido_pa, a.apellido_ma, h.idDiaSemana AS dia, la.hora AS 'hora_registrado' 
             FROM listaAlums AS la JOIN alumnos AS a ON la.matriculaAlum = a.matriculaAlum 
             JOIN lista AS li ON la.codigo = li.codigo 
             JOIN horario AS h ON li.idHorario = h.idHorario 
             JOIN clases AS c ON h.idClase = c.idClase WHERE li.codigo=?;`; // Asegúrate de que 'codigo' es el id correcto para la consulta
    
            db.query(consulta, [codigo], (err, results) => {
                if (err) {
                    reject({ msj: 'Error al obtener la consulta', err });
                } else {
                    if (results.length > 0) {
                        resolve({ alumsAsist: results, status: true });
                    } else {
                        reject({ msj: 'No hay empleados asistidos', status: false });
                    }
                }
            });
        });
    }
    

    ObtenerClasesProfesor(db, matricula) {
        return new Promise((resolve, reject) => {
            const consulta = `SELECT c.idClase, c.nombre as 'clase' , c.grupo FROM clases as c, profesores as p WHERE c.matriculaProfe=p.matricula and p.matricula=?;`;
            db.query(consulta, [matricula], (err, results) => {
                if (err) {
                    reject({ msj: 'Error al obtener la consulta' });
                }
                else {
                    if (results.length > 0)
                        resolve({ clases: results });
                    else
                        reject({ msj: 'No hay clases registradas' });
                }
            });
        });
    }
    ObtenerCodigoClaseHoy(db, idHorario) {
        return new Promise((resolve, reject) => {
            const consulta = `
                SELECT l.codigo, c.nombre 
                FROM lista AS l 
                JOIN horario AS h ON l.idHorario = h.idHorario  
                JOIN clases AS c ON h.idClase  = c.idClase  
                WHERE l.dia = CURDATE() AND h.idHorario  = ?;
            `;
            db.query(consulta, [idHorario], (err, results) => {
                if (err) {
                    console.error('Error en la consulta:', err);
                    reject({ msj: 'Error al obtener la consulta' });
                } else {
                    if (results.length > 0) {
                        resolve({ results });
                    } else {
                        reject({ msj: 'La clase no tiene código asociado el día de hoy', status: false });
                    }
                }
            });
        });
    }
    
    ObtenerHistorialLista(db, grado, grupo, clase) {
        return new Promise((resolve, reject) => {
            const consulta = `SELECT li.dia as 'fecha' , li.codigo, di.nombre as 'diasemana', c.nombre as 'clase' , c.grado, c.grupo
            FROM clases as c, horario as h, lista as li, diasSemana as di
            WHERE c.grado=?and c.grupo=? and c.diasSemanare=? and  c.idClase=h.idClase and di.idDiaSemana=h.idDiaSemana and h.idHorario=li.idHorario;`;
            db.query(consulta, [grado, grupo, clase], (err, results) => {
                if (err) {
                    reject({ msj: 'Error al obtener la consulta' });
                }
                else {
                    if (results.length > 0)
                        resolve({ historyList: results });
                    else
                        reject({ msj: 'No hay pases de listas registrados en esta clase' });
                }
            });
        });
    }
    CrearListaHoy(db, codigo, horario) {
        return new Promise((resolve, reject) => {
            const consulta = `INSERT INTO lista(id ,codigo, dia, idHorario) VALUES (null,?,NOW(),?)`;
            db.query(consulta, [
                codigo, horario //, limite, duracion
            ], (err, result) => {
                if (err)
                    reject({ msj: 'Error al registrar la lista de hoy', err });
                else
                    resolve({ msj: 'Se ha asociado el codigo correctamente' });
            });
        });
    }
    CrearHorario(db, idClase, horaInit, horaFin, salon, idDiaSemana) {
        return new Promise((resolve, reject) => {
            const consulta = `INSERT INTO horario( horaInit, horaFin, salon, idDiaSemana, idClase) VALUES (?, ?, ?, ?, ?)`;
            db.query(consulta, [
                horaInit, horaFin, salon, idDiaSemana, idClase //, limite, duracion
            ], (err, result) => {
                if (err)
                    reject({ msj: 'Error al registrar el horario', status: false });
                else
                    resolve({ msj: 'Se ha registrado correctamente el horario', status: true });
            });
        });
    }
    RegistrarAlumnoListaHoy(db, codigo, matriculaAlum) {
        return new Promise((resolve, reject) => {
            const consulta = 'INSERT INTO listaalums VALUES (?,?,NOW())';
            db.query(consulta, [
                codigo, matriculaAlum
            ], (error) => {
                if (error)
                    reject({ msj: 'Error al registrar el alumno a la lista de hoy' });
                else
                    resolve({ msj: `El alumno ${matriculaAlum} se ha agregado a la lista de hoy` });
            });
        });
    }
    CrearClase(db, nombre, grupo, matricula) {
        return new Promise((resolve, reject) => {
            let consulta = `INSERT INTO clases(idClase ,nombre, grupo, matriculaProfe ) VALUES (null ,?, ?, ?);`;
            db.query(consulta, [nombre, grupo, matricula], (err, result) => {
                if (err)
                    reject({ msj: 'Error al realizar el registro de la area', status: false });
                else
                    resolve({ msj: 'El area a sido agregada con exito', status: true });
            });
        });
    }
    BuscarAlumno(db, matriculaAlum) {
        return new Promise((resolve, reject) => {
            let consulta = `SELECT * FROM alumnos as a WHERE a.matriculaAlum=? `;
            db.query(consulta, [matriculaAlum], (err, result) => {
                if (err)
                    reject({ msj: 'Error al verificar si el alumno esta registrado' });
                else {
                    if (result.length > 0)
                        resolve(result[0]);
                    else
                        reject({ msj: `No existe el alumno con matricula ${matriculaAlum}` });
                }
            });
        });
    }
} //FIN CLASS
exports.default = Profesor;
//# sourceMappingURL=profesor.js.map