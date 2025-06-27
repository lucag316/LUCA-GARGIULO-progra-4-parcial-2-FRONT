
export interface Usuario {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    username: string;
    fechaNacimiento: Date;
    descripcion: string;
    imagenPerfil?: string;
    perfil: string;
    isActive: boolean;
    createdAt?: Date; // Asegúrate de que coincida con tu backend
}