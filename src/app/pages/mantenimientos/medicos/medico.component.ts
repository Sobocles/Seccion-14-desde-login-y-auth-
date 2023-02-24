import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {
  medicoForm: FormGroup;
  hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor( private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private route: Router,
              private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({id}) => {//SE OBETIEN SOLAMENTE EL ID  DEL URL MEDIANTE LA DESESTRUCTURACION
       console.log(id);
      this.cargarMedico(id)                        //ESTE ID ES EL MISMO DEL PATH QUE ESTA EL EL PAGES.ROUTING 
    })                                                 //path: 'medico/:id'
      //console.log(id);
    

    this.medicoForm = this.fb.group({
      nombre: ['Hernando', Validators.required ],
      hospital: ['2', Validators.required ],
    
    })
    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges //CADA VES QUE HAYA UN CAMBIO EN hospital (CUANDO SELECCIONO UNA OPCION DEL MENU DESPLEGABLE SELECT) Se captura el id
      .subscribe( hospitalId => { //ME SUBSCRIBO A LOS CAMBIOS QUE SE PRODUCAN EN HOSPITAL Y CAPTURO EL ID DEL HOSPITAL SELECIONADO

        this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId ); //LUEGO CON ESE ID SE BUSCA EN EL ARREGLO DE HOSPITALES EL HOSPITAL QUE CALZE CON ESE ID PARA OBTENER E HOSPITAL CON TODAS SUS PROPIEDADES
        // console.log(this.hospitalSelecionado);   las propiedades quese almacenan en hospitalSelecionado son _id, img, nombre - usuario {_id, img, nombre }
      })
  }

  cargarMedico( id:string ){

    if( id=== 'nuevo' ){
      return;
    }

    this.medicoService.obtenerMedicoPorId( id )
    .pipe(
      delay(100)
    )
      .subscribe( medico =>{

        if( !medico ){
          return this.route.navigateByUrl(`/dashboard/medicos`);
        }
        
        const { nombre, hospital:{ _id } } = medico; //SE DESESTRUCUTRA EL OBJETO se pone hospital:{ _id } porque es un objeto que esta dentro de otro (de medico) y queremos acceder solo al id de hospital
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue( {nombre, hospital: _id });
        //console.log(medico)
      })
  }
  cargarHospitales(){
    this.hospitalService.cargarHospitales()
      .subscribe( (hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      })
  }

  guardarMedico() {
    
    const { nombre } = this.medicoForm.value;

    if( this.medicoSeleccionado ){
      //actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico( data )
        .subscribe( resp => {
          console.log(resp)
          Swal.fire('Actualizado', `${ nombre } Actualizado correctamente`, 'success');
        })
    }else {
      //crear
      const { nombre } = this.medicoForm.value;
      console.log(this.medicoForm.value)
      this.medicoService.crearMedico( this.medicoForm.value )
        .subscribe( (resp:any) => {
          console.log(resp);
          Swal.fire('Creando', `${ nombre } creado correctamente`, 'success');
          this.route.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`)
        })
    }

 
  }

}
