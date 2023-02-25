import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

  const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  medicos: Medico[] = [];

  constructor( private http: HttpClient ) { }

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
  cargarMedicos() {
    //localhost:3000/api/usuarios?desde=0
    const url = `${ base_url }/medicos`;
    return this.http.get( url, this.headers)
        .pipe(
            map( (resp: {ok: boolean, medicos: Medico[] }) => resp.medicos ) 
            /*LA LINEA resp: {ok: boolean, medicos: Hospital[] } REPRESENTA LO QUE VIENE EN LA RESPUESTA QUE ES
             ok:true y un arreglo con los medicos, esto se hace para que en la parte del subscribe donde se invoca el metodo
             se sepa que las resp viene un arreglo de hospitales de tipo hospital */
        );
        
  }

  obtenerMedicoPorId( id: string ){
    const url = `${ base_url }/medicos/${ id }`;
    return this.http.get( url, this.headers )
          .pipe(
              map( (resp: {ok: boolean, medico: Medico }) => { //IMPORTANTE!! QUE {ok: boolean, medico: Medico } DEBEN ESTAR EXACTAMENTE ESCRITOS DE COMO VIENEN EN LA RESPUESTA DEL BACKEND si pongo medicos con unas al final puede dar un undefind cuando quiera hacerle console log a la respuesta al momento de subscribir a este metodo de este servicio
                console.log(resp);
                return resp.medico;
              })
          );
  }

  crearMedico( medico: { nombre: string, hospital: string } ) { //aca va a venir el nombre y nuevo hospital
    const url = `${ base_url }/medicos`;
    return this.http.post( url, medico, this.headers );
  }

  actualizarMedico( medico: Medico ){
    const url = `${ base_url }/medicos/${ medico._id }`;
    return this.http.put( url, medico, this.headers );
  }

  borrarMedico( _id: string ){
    const url = `${ base_url }/medicos/${ _id }`;
    return this.http.delete( url, this.headers );
  }

}
