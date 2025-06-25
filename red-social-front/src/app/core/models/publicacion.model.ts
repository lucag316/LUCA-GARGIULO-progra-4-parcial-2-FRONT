
export interface Publicacion {
    _id: string;
    titulo: string;
    descripcion: string;
    imagenUrl?: string;
    autor: string; // puede ser ID o un objeto según tu API
    autorNombre?: string;
    likes: string[]; // IDs de usuarios que dieron like
    fechaCreacion: string;
    estaEliminado: boolean;
}