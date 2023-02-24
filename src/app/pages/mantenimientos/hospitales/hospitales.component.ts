import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';
import { HospitalService } from '../../../services/hospital.service'

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor( private hospitalService: HospitalService, private modalImagenService: ModalImagenService, private busquedasService: BusquedasService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
      this.cargarHospitales();

      this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
        .pipe(delay(100))
          .subscribe( img => this.cargarHospitales() );
  }

    buscar( termino: string ){
        if( termino.length === 0 ){
          return this.cargarHospitales();
    }
    
        this.busquedasService.buscar( 'hospitales', termino )
          .subscribe( resp => {
            this.hospitales = resp;
          });
        }

    cargarHospitales(){

      this.cargando = true;
      this.hospitalService.cargarHospitales()
        .subscribe( hospitales => {
          this.cargando = false;
          this.hospitales = hospitales;
        })
    }

    guardarCambios( hospital: Hospital ){
      this.hospitalService.actualizarHospital( hospital._id, hospital.nombre )
        .subscribe( resp => {
          Swal.fire( 'Actualizado', hospital.nombre, 'success')
        })
    }

    eliminarHospital( hospital: Hospital ){
      this.hospitalService.borrarHospital( hospital._id )
        .subscribe( resp => {
          this.cargarHospitales();
          Swal.fire('Borrado', hospital.nombre, 'success' );
        });
    }

    async abrirSweetAlert(){
      const { value = '' } = await Swal.fire<string>({ //value es lo que escribe el usuario en la ventana Emergente del sweetAlert (si value no tiene ningun valor se iguala a un string vacio)
        title: 'Crear hospital',
        text: 'Ingrese el nombre del nuevo hospital',
        input: 'text',
        inputPlaceholder: 'Nombre del hospital',
        showCancelButton: true,
      })
      if( value.trim().length > 0 ) { //La expresión value.trim() devuelve una nueva cadena de caracteres con los espacios en blanco eliminados.
        this.hospitalService.crearHospital( value )
        .subscribe( (resp:any) => {
          this.hospitales.push( resp.hospital )
        })
      }
    }

    abrirModal(hospital: Hospital){
      this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
      console.log(hospital.img);
    }

}
