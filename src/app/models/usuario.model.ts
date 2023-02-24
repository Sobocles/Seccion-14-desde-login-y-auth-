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

     get imagenUrl(){ //UNA FUNCION QUE RETORNA LA DIRECCION DE LA IMAGEN DEL USUARIO EN BASE A SI ESTA EXISTE O NO (SI EL USUARIO TIENE UNA IMAGEN O NO) PARA PODER MOSTRARLA EN EL SIDEBAR, EN EL HEADERS ETC

        if( !this.img ){
            return `${ base_url }/upload/usuarios/no-image`; //SI NO TIENE IMAGEN
        } else if( this.img.includes('https') ){ //SI TIENE UNA IMAGEN DE GOOGLE
            return this.img;
        } else if ( this.img ) {
            return `${ base_url }/upload/usuarios/${ this.img }`; //SI TIENE UNA IMAGEN
        } else {
            return `${ base_url }/upload/usuarios/no-image`;
        }
      
     }

}