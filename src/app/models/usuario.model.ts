import { environment } from "src/environments/environment";

const base_url = environment.base_url;

export class Usuario {
//EL ORDEN ACA IMPORTA OJO CUAN
    constructor( 
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string, 
        public google?: boolean,
  
        public role?: string,
        public uid?: string,
     ) {}

     get imagenUrl(){

        if( this.img.includes('https') ){
            return this.img;
        }
        //upload/usuario/no-imagen
        if ( this.img ) {
            return `${ base_url }/upload/usuarios/${ this.img }`;
        } else {
            return `${ base_url }/upload/usuarios/no-image`;
        }
      
     }

}