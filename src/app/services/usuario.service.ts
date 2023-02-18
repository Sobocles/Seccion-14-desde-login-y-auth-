import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { RegisterForm } from '../interfaces/register-form.register';
import { LoginForm } from '../interfaces/login-form.interface';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model'

declare const google: any;

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario;

  constructor( private http: HttpClient, private router: Router ) { }

  logout(){
    localStorage.removeItem('token');
    google.accounts.id.revoke('smoralespincheira@gmail.com', () => {
      this.router.navigateByUrl('/login');
    })
    
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid():string {
    return this.usuario.uid || '';
  }

  validarToken(): Observable<boolean> {
  

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token //ESTE ES EL GET TOKEN
      }
    }).pipe(
      map( (resp: any) => {
      
        const { email, google, nombre, role, img='', uid } = resp.usuario; //SE DESESTRUCTURA LO QUE LLEGA DE LA RESPUESTA DEL BACKEND
      
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid ); //SE CREA EL OBJETO USUARIO
        console.log(this.usuario);
        localStorage.setItem('token', resp.token );
        return true
      }),
     
      catchError( error => of(false) )
    );

  }

  crearUsuario( formData: RegisterForm ){
    console.log('creando usuario')    
    return this.http.post(`${base_url}/usuarios`,formData )
        .pipe( //El operador pipe() es una función que permite encadenar una serie de operaciones sobre un flujo de datos (en este caso, los datos devueltos por la solicitud HTTP)
            tap( (resp: any) => { //el tap() permite interceptar esos datos para realizar una acción específica (en este caso, almacenar el token en el localStorage).
              localStorage.setItem('token', resp.token ) //En este caso específico, la operación tap() se utiliza para almacenar el valor del token en el localStorage del navegador. El token se obtiene a partir de la respuesta (resp) que se recibe de la solicitud HTTP y se almacena con la llave 'token'.
            })
        )
  }

  actualizarPerfil(  data: { email: string, nombre: string, role: string } ){

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${ base_url }/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token //ESTE ES EL GET TOKEN
      }
    })
  }

  login( formData: LoginForm ){
    return this.http.post(`${base_url}/login`,formData )
        .pipe( //El operador pipe() es una función que permite encadenar una serie de operaciones sobre un flujo de datos (en este caso, los datos devueltos por la solicitud HTTP)
          tap( (resp: any) => { //el tap() permite interceptar esos datos para realizar una acción específica (en este caso, almacenar el token en el localStorage).
            localStorage.setItem('token', resp.token ) //En este caso específico, la operación tap() se utiliza para almacenar el valor del token en el localStorage del navegador. El token se obtiene a partir de la respuesta (resp) que se recibe de la solicitud HTTP y se almacena con la llave 'token'.
          })
        )

  }

  loginGoogle( token: string ){
    return this.http.post(`${ base_url }/login/google`,{ token })
      .pipe(
        tap( (resp: any ) => {
     
          localStorage.setItem('token', resp.token)
        })
      )
  }

}
