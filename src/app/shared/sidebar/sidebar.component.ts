import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  usuario: Usuario;
  menuItems: any[];

  constructor( private sidebarService: SidebarService, private usuarioServer: UsuarioService ) {
    this.menuItems = sidebarService.menu;
    this.usuario = this.usuarioServer.usuario;
    //console.log(this.menuItems)
  }
  

  ngOnInit(): void {
  }

}
