import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public classTheme: string | null = this.getClassTheme();

  constructor() { }

  // ** Private API **

  private getClassTheme(): string {
    const day = (new Date()).getDate();
    return 'a-theme' + (day % 10);
  }

}
