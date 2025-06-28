
export interface Comentario {
    _id: string;
    contenido: string;
    autor: {
        _id: string;
        username: string;
        imagenPerfil: string;
    };
    fechaCreacion: Date;
    modificado?: boolean;
    editando?: boolean; // para manejo en UI
    nuevoContenido?: string;
}