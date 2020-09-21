import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-t-l-header',
  templateUrl: './t-l-header.component.html',
  styleUrls: ['./t-l-header.component.scss']
})
export class TLHeaderComponent implements OnInit {

  @Input()
  public labelName: string;

  constructor() { }

  ngOnInit(): void {
  }

}
