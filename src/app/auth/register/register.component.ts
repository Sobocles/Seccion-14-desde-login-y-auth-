import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.required]],
    password: ['', Validators.required ],
    password2: ['', Validators.required ],
    terminos: ['', Validators.required] 

  }, {
    validators: this.passwordsIguales('password','password2') //SE ENVIAN LOS DOS ARGUMENTOS QUE SE QUIEREN VALIDAR
  });


  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) { }

  crearUsuario() {
    this.formSubmitted = true;
    console.log( this.registerForm.value );
    //console.log( this.registerForm.value );

    if( this.registerForm.invalid ){
      return
    }

    // Realizar el posteo
    this.usuarioService.crearUsuario( this.registerForm.value )
        .subscribe( resp => {
          
        // Navegar al Dashboard
        this.router.navigateByUrl('/');

        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        } );
  }

  campoNoValido( campo: string ): boolean {
    if( this.registerForm.get(campo).invalid && this.formSubmitted ){ //SI EL FORMULARIO SE POSTEO Y EL CAMPO NO ES VALIDO
      return true;
      } else{
        return false;
      }
  }

  contrasenasNoValidas(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if((pass1 !== pass2 ) && this.formSubmitted ) { //SI EL FORMULARIO HA SIDO POSTEADO Y LAS CONTRASENAS SON DIFERENTES
      return true;
      } else {
        return false;
      }
    }
  

  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  passwordsIguales(pass1Name: string, pass2Name:string ){

    return( formGroup: FormGroup ) => {
      
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if( pass1Control.value === pass2Control.value ){
        pass2Control.setErrors(null)
      } else {
        pass2Control.setErrors({ noEsIgual: true })
      }

    }
  }
}


