import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

  
  

  constructor( private settingsService: SettingsService) { }

  ngOnInit(): void {
      this.settingsService.checkCurrentTheme();
  }

  changeTheme( theme: string ) {

    this.settingsService.changeTheme( theme );

  }

 

}

/* Este código es una función llamada "checkCurrentTheme" que se utiliza para verificar el tema actual 
en un sitio web. La función hace lo siguiente:
    Selecciona todos los elementos con la clase "selector" en la página.
    Itera a través de cada uno de los elementos seleccionados y realiza las siguientes acciones:

    a. Elimina la clase "working" del elemento actual.
    b. Obtiene el atributo "data-theme" del elemento actual y lo almacena en la variable "btnTheme".
    c. Crea una URL para el tema actual utilizando la variable "btnTheme" y la almacena en la variable "btnThemeUrl".
    d. Obtiene el atributo "href" del enlace de tema actual y lo almacena en la variable "currentTheme".
    e. Si la URL del tema actual (btnThemeUrl) coincide con el atributo "href" del enlace de tema actual (currentTheme), agrega la clase "working" al elemento actual.

Esta función permite verificar qué tema está activo en un momento dado y agregar una clase CSS específica 
a un elemento que corresponda a ese tema. */

/* La variable "btnThemeUrl" representa la URL del tema que se está revisando en la iteración actual del ciclo "forEach". La variable "currentTheme" representa la URL del tema actualmente en uso en la página web.

Si "btnThemeUrl" y "currentTheme" son iguales, significa que el tema actual en uso coincide con el tema
 que se está revisando en la iteración actual del ciclo "forEach". Por lo tanto, se agrega la clase
  "working" al elemento correspondiente para indicar que este es el tema actual en uso. De lo contrario,
   si no coinciden, se continúa iterando hasta encontrar el tema correcto. */