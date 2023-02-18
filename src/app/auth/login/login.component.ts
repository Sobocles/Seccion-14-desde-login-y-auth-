import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';
import { tap } from 'rxjs/operators';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements AfterViewInit {
  
  @ViewChild('googleBtn') googleBtn: ElementRef;

  public formSubmitted = false;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.required]],
    password: ['', Validators.required ],
    remember: [false],
  })


  constructor( private router: Router, private fb: FormBuilder, private usuarioService: UsuarioService ) { }

  ngAfterViewInit(): void {
      this.googleInit();
    
  }

/* La función googleInit es llamada al iniciar la aplicación y tiene como objetivo inicializar la API de
 autenticación de Google y renderizar un botón de inicio de sesión personalizado. */
  googleInit(){
    google.accounts.id.initialize({
      client_id: "357063670705-5bnv709p6tdgd1oiho3q2fon8v1vgm6j.apps.googleusercontent.com",
      callback: (response:any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
   
      this.googleBtn.nativeElement,
      
      { theme: "outline", size: "large" }  // customization attributes
      )
  }

  handleCredentialResponse( response: any){
      console.log("Encoded JWT ID token: " + response.credential);
        this.usuarioService.loginGoogle( response.credential )
            .subscribe( resp => {
            
              this.router.navigateByUrl('/');
            })
  }

  login(){

    this.usuarioService.login( this.loginForm.value )
        .subscribe( resp => {
          if( this.loginForm.get('remember').value ){
            localStorage.setItem('email', this.loginForm.get('email').value);
          } else {
            localStorage.removeItem('email');
          }

        // Navegar al Dashboard
        this.router.navigateByUrl('/');
        
        }, (err) => {
        //Si sucede un error
        //console.log(err);
        Swal.fire('Error', err.error.msg, 'error');
     
    //console.log(this.loginForm.value)
    //this.router.navigateByUrl('/');
    });

  }



}