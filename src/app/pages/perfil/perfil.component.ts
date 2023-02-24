import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario; //LOS SERVICIOS SON SINGLETONS, ES DECIR EN TODOS LOS LUGARES DONDE SE USE EL USUARIO
                          // SE ESTA MANEJANDO LA MISMA INSTANCIA Y AUNQUE AQUI SE ESTE MODIFICANDO LA PROPIEDAD LOCAL (CONTINUA ABAJO)
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private fileUploadService: FileUploadService ) { 
    this.usuario = this.usuarioService.usuario; //REALMENTE ESTAMOS MODIFICANDO EL USUARIO SERVICE PORQUE AQUI SE ESTA HACIENDO LA ASIGNACION AL PUNTERO DONDE ESTA LA INFORMACION
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required ],
      email: [this.usuario.email, [ Validators.required, Validators.email ] ],
    });
  }

  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil( this.perfilForm.value ) //EN PERFILFORM.VALUE TE TIENEN EL NOMBRE Y EL EMAIL
      .subscribe( resp => {

        console.log(resp)
        /*{
    "ok": true,                         ESTA ES LO QUE VENDRIA EN UNA HIPOTETICA RESPUESTA DEL BACKEND,  
    "usuario": {                        EL USUARIO CON TODOS SUS CAMPOS + EL QUE SE MODIFICO (EN ESTE CAOS EMAIL)
        "nombre": "Haru Okumura",       DE ACUERDO A LO QUE EL USUARIO INGRESO EN EL FORMULARIO Y QUE SE ALMACENO EN perfilForm.value
        "email": "thief@gmail.com",
        "role": "USER_ROLE",
        "google": false,
        "img": "d9640545-447b-4718-9a7f-a8d70e699095.jpg",
        "uid": "63f01b1d09d7d70a9e03557a"
    }   console.log(resp)
      });*/
      const {nombre, email } = this.perfilForm.value; //SE DESESTRUCTURA LA RESPUESTA ANTERIOR Y SE ALMACENAN EN NOMBRE E EMAIL
      this.usuario.nombre = nombre; //POR LO EXPUESTO ANTERIORMENTE (ARRIBA) EN TODOS LOS LUGARES DONDE SE USE USUARIO.NOMBRE O EMAIL CAMBIARA POR EL NUEVO USUARIO ACTUALIZADO
      this.usuario.email = email;

        Swal.fire('Guardado', 'Cambios fueron guardados','success');
      }, (err) => {
        Swal.fire('Error', err.error.msg,'error');
      });
  }

  cambiarImagen( file: File ) {
    this.imagenSubir = file;

    if ( !file ) { 
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }

  }

  subirImagen(){
    this.fileUploadService
      .actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid ) //IMAGEN A SUBIR SE CAPTURO EN LA FUNCION CAMBIAR IMAGEN CUANDO SE ESCOGIO UNA IMAGEN  AL DARLE EXAMINAR
      .then( img => {
         this.usuario.img = img; //SE MODIFICA LA IMAGEN DEL USUARIO PARA ACTUALIZARLA EN TODOS LADOS LA LA APLICACION POR LA IMAGEN NUEVA (OSEA EN EL SIDEBAR Y HEADER)
         Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success'); 
         }).catch( err => {
          console.log(err);
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
         })
  }

}
