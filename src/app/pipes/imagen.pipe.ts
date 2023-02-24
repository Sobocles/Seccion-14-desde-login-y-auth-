import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

  const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

 
  transform( img: string, tipo: 'usuarios' | 'medicos' |'hospitales' ):string {
  

    if( !img ){
      return `${ base_url }/upload/usuarios/no-image`; //SI NO TIENE IMAGEN
  } else if( img.includes('https') ){ //SI TIENE UNA IMAGEN DE GOOGLE
      return img;
  } else if ( img ) {
      return `${ base_url }/upload/${ tipo }/${ img }`; //SI TIENE UNA IMAGEN
  } else {
      return `${ base_url }/upload/usuarios/no-image`;
  }
  }

}
