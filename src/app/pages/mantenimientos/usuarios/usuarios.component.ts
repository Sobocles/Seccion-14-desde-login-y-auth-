import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import {BusquedasService } from 'src/app/services/busquedas.service'
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuarioTemp: Usuario[]; //TIENE QUE SER UN ARREGLO PARA QUE LE CAIGAN LAS WEAS CUANDO SE USA this.usuarioTemp = usuarios;

  public imgSubs: Subscription
  public desde: number = 0;
  public cargando: boolean = true;
  


  constructor( private usuarioService: UsuarioService, 
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {  
    this.cargarUsuarios();

    this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe( img => { 
      console.log(img);
      this.cargarUsuarios()
    });
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios( this.desde )
    .subscribe( ({total, usuarios })=> { //SE DESESTRUCTURA LA RESPUESTA QUE LLEGA DE LA SOLICITUD
      this.totalUsuarios = total;
      this.usuarios = usuarios; 
      this.usuarioTemp = usuarios;
      this.cargando = false;
    })
  }

  cambiarPagina( valor: number ) {
    this.desde +=valor;

    if( this.desde < 0){
      this.desde = 0;
    } else if( this.desde >= this.totalUsuarios ){
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar( termino: string ){
    if( termino.length === 0){
      return this.usuarios = this.usuarioTemp;
    }
    this.busquedasService.buscar('usuarios', termino )
      .subscribe( resultados => 
        this.usuarios = resultados ); //SE IGUALA A USUARIOS YA QUE USUARIO ESTA EN EL USUARIOS.COMPONENT.HTML EN FORMA DE {{usuario.nombre}} etc Y RESULTADOS TRAE LOS RESULTADOS DE LA BUSQUEDA DEACUERDO AL TERMINO DE LA TECLA QUE SE PRESIONO
  }

  eliminarUsuario( usuario:Usuario ) {
    if( usuario.uid === this.usuarioService.uid ){
      return Swal.fire('Error', 'No se puede borrarse a si mismo', 'error');
    }
    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si borralo'
    }).then((result) => {
      if (result.isConfirmed) {

          this.usuarioService.eliminarUsuario( usuario )
            .subscribe( resp => {             
              this.cargarUsuarios();
              Swal.fire(
                'Usuario borrado',
                `${ usuario.nombre } fue eliminado correctamente`,
                'success'                
              ) 
            } 
          )
            
      }
    })
  }

  cambiarRole( usuario: Usuario ){
    this.usuarioService.guardarUsuario( usuario )
      .subscribe( resp => {
        console.log(resp);
      })
  }

  abrirModal( usuario: Usuario ){
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
 
}
