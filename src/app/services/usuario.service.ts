import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { RegisterForm } from '../interfaces/register-form.register';
import { LoginForm } from '../interfaces/login-form.interface';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

declare const google: any;

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient, private router: Router ) { }

  logout(){
    localStorage.removeItem('token');
    google.accounts.id.revoke('smoralespincheira@gmail.com', () => {
      this.router.navigateByUrl('/login');
    })
    
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token );
      }),
      map( resp => true),
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
          console.log(resp)
          localStorage.setItem('token', resp.token)
        })
      )
  }

}
