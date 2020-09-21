import { Component, OnInit, Input } from '@angular/core';
import { Nav } from './nav.interface';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @Input()
  public navList: Nav[];

  constructor() { }

  ngOnInit(): void {
  }

}
