import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

type NewType = Subscription;

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: NewType;

  constructor() { 
    // Se suscribe al Observable retornado por retornaObservable y proporciona tres funciones para manejar valores emitidos, errores y la finalización del Observable.
    /*
    this.retornaObservable().pipe(
      retry(2) // En caso de error, el Observable se volverá a intentar dos veces.
    ).subscribe(
      valor => console.log('subs ',valor), // Función que maneja valores emitidos.
      error => console.warn('Error', error), // Función que maneja errores.
      () => console.info('Obs terminado') // Función que maneja la finalización del Observable.
    ); */
      this.intervalSubs = this.retornaIntervalo().subscribe( console.log )
      
  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

   retornaIntervalo(): Observable<number>{

    return interval(1000)
              .pipe(
                take(20), //se ledice cuantas emisiones del observable se necesitan y al llegar automaticamente completa el observable (se finaliza la emision)
                map( valor => valor + 1 ), //EL MAP SIRVE PARA TRANSFORMAR LA INFORMACION QUE RECIBE EL OBSERVABLE Y MUTARLA DE LA MANERA QUE SE NECESITA (EN ESTE CASO VA A MOSTRAR LA EMISION DESDE EL 1 EN ADELANTE NO DEL 0)
                filter( valor => (valor % 2 === 0) ?true : false ), //EL OPERADOR FILTER SIRVE PARA VER SI SE QUIERE EMITIR UN VALOR O NO DE MANERA CONDICIONAL
              );

 
    }


    retornaObservable(): Observable<number>{ // Devuelve un Observable que está emitiendo números.
      let i = -1; // Inicializa un contador i con -1.
      const obs$ = new Observable<number>( observer => { // Crea un nuevo Observable llamado obs$.
        // Establece un intervalo de tiempo que se ejecutará cada 1000 milisegundos.
        const intervalo = setInterval( () => {
          // Aumenta el contador i en 1.
          i++;
          // Emite el valor actual de i a los suscriptores del Observable.
          observer.next(i);
          // Si i es igual a 4, detiene el intervalo y marca el Observable como completado.
          if( i === 4 ) {
            clearInterval( intervalo );
            observer.complete();
          }
          // Si i es igual a 2, emite un mensaje de error.
          if( i === 2 ){
            observer.error('i llegó al valor de 2');
          }
        }, 1000 )
    
      });
      // Devuelve obs$.
      return obs$;
    }

  

}



/*
            VERSION ANTIGUA DEL CODIGO COMENTADA
  constructor() { 

  // Crea un nuevo Observable llamado obs$
  const obs$ = new Observable( observer => {

    // Inicializa un contador i con -1
    let i = -1;

    // Establece un intervalo de tiempo que se ejecutará cada 1000 milisegundos
    const intervalo = setInterval( () => {

      // Aumenta el contador i en 1
      i++;

      // Emite el valor actual de i a los suscriptores del Observable
      observer.next(i);

      // Si i es igual a 4, detiene el intervalo y marca el Observable como completado
      if( i === 4 ) {
        clearInterval( intervalo );
        observer.complete();
      }

      // Si i es igual a 2, emite un mensaje de error
      if( i === 2 ){
        observer.error('i llego al valor de 2');
      }
    }, 1000 )

  });

  // Se suscribe al Observable y proporciona tres funciones para manejar valores emitidos, errores y la finalización del Observable
  obs$.subscribe(
    valor => console.log('subs ',valor), // Función que maneja valores emitidos
    error => console.warn('Error', error), // Función que maneja errores
    () => console.info('Obs terminado') // Función que maneja la finalización del Observable
  );

}
*/




