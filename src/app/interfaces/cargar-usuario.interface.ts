import { Usuario } from '../models/usuario.model';

export interface cargarUsuario {
    total: number
    usuarios:Usuario[];
}