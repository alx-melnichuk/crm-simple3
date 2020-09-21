import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-l-header',
  templateUrl: './c-l-header.component.html',
  styleUrls: ['./c-l-header.component.scss']
})
export class CLHeaderComponent implements OnInit {

  @Input() public labelName: string;

  constructor() { }

  ngOnInit(): void {
  }

}
