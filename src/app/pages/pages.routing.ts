import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
    { 
        
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [ AuthGuard ], //TODAS ESTAS RUTAS ESTAN PROTEGIDAS, SI NO ESTA AUTENTICADO NO DEBERIA VER NINGUNA DE ESTAS
        children: [
            { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de cuenta'} },
            { path: 'buscar/:termino', component: BusquedaComponent, data: { titulo: 'Busquedas' } }, //OJO!! CON COMO SE ESCRIBE LA RUTA ES 'buscar/:termino' Y NO!! 'buscar:/termino'
           
            { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Gráfica #1' }  },
            { path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil de usuario' }},
            { path: 'progress', component: ProgressComponent, data: { titulo: 'progressBar'} },
            { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas'} },
            { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs'} },
            //Mantenimientos
            { path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Mantenimiento de hospitales'}},
            { path: 'medicos', component: MedicosComponent, data: {titulo: 'Mantenimiento de Medicos'}},
            { path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Mantenimiento de Medicos'}},
            // Rutas de Admin

            { path: 'usuarios', canActivate: [ AdminGuard ], component: UsuariosComponent, data: {titulo: 'Mantenimiento de usuarios'}},
        ]
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}


