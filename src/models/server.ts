import express, { Application } from "express";
import cors from "cors";
import mysql from "../db/conect";

// Imports de Rutas
import profesRouter from "../routes/profes.routes";
import alumnoRouter from "../routes/alumnos.routes";
import authRouter from "../routes/autenticador.routes";
import registroRouter from "../routes/registros.routes";

class Server {
    private app: Application;
    private port: string;
    private baseUrl: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '8000';
        this.baseUrl = 'https://web-production-162a.up.railway.app';

        // Métodos Iniciales
        this.conectarDB();
        this.middlewares();
        this.routes();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en ${this.baseUrl}:${this.port}`);
        });
    }

    routes() {
        this.app.use('/auth', authRouter);
        this.app.use('/registro', registroRouter);
        this.app.use('/profesores', profesRouter);
        this.app.use('/alumnos', alumnoRouter);
        console.log('Rutas Listas');
    }

    middlewares() {
        // CORS
        this.app.use(cors());
        // Lectura del Body
        this.app.use(express.json());
        // Carpeta Pública
        this.app.use(express.static('public'));
        console.log('Middlewares Listos');
    }

    conectarDB() {
        try {
            mysql.connect((err) => {
                if (err) {
                    console.log('Error al establecer la conexión'); 
                    mysql.on('error', this.conectarDB); 
                } else {
                    console.log('Conectado a la base de datos');
                }
            });
        } catch (ex) {
            console.log('Ha fallado el servidor');
        }
    }
}

export default Server;
