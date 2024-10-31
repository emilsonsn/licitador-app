import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'automationStatus'
})
export class AutomationStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value){
      case 'Waiting':
        return '🟠 Aguardando';        
      case 'Running':
        return '🔵 Em execução';
      case 'Finished':
        return '🟢 Concluído';
      case 'Error':
        return '🔴 Erro';
      default:
        return 'Não encontrado';
    }
    return null;
  }

}
