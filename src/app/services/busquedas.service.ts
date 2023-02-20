import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {environment} from '../../environments/environment'
import {map} from 'rxjs/operators'
import { Usuario } from '../models/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  base_url = environment.base_url;

  constructor( private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { 
      headers: {
      'x-token': this.token //ESTE ES EL GET TOKEN
      }
    }
  }

  private transformarUsuarios( resultados: any[] ):Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email,'',user.img,user.google,user.role,user.id) //ACA TRANSFORMA ESE RESULTADO QUE ES ANY EN UN TIPO USUARIO PARA QUE EN USUARIOS COMPONENT LO PUEDA RECIBIR
    )
  }

  buscar(
    tipo: 'usuarios' |'medicos' | 'hospitales',
    termino: string
  ) {
    const url = `${ this.base_url }/todo/coleccion/${ tipo }/${ termino }`;
    return this.http.get<any[]>( url, this.headers ) //AQUI HAY QUE DECIRLE QUE SE RECIBE UN ARREGLO PORQUE LLEGA UN ARREGLO DEL FRONTEND
      .pipe(
        map( (resp: any ) => {
          
          switch ( tipo ) {
            case 'usuarios':
              return this.transformarUsuarios( resp.resultados )
              
            default:
              return[];
          }
        } )
      );
  }
}
