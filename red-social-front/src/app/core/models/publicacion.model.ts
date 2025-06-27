export interface Comentario {
    contenido: string;
    autor: {
        username: string;
        imagenPerfil?: string;
    };
    fechaCreacion: string;
}

export interface Publicacion {
    _id: string;
    titulo: string;
    descripcion: string;
    imagenUrl?: string;
    autor: {
        _id: string;
        username: string;
        imagenPerfil?: string;
    };
    likes: string[]; // IDs de usuarios que dieron like
    fechaCreacion: string;
    estaEliminado: boolean;
    comentarios?: Comentario[];
}

