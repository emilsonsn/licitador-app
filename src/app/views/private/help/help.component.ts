import { Component } from '@angular/core';
import {environment} from "@env/environment";

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
  link: string = `https://wa.me/${environment.phoneNumber}`;
  phoneNumber: string = environment.phoneNumber;

}
