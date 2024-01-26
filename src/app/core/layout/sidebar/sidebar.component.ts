import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(private routes: Router){ }

  goToIndexPage() :void {
    this.routes.navigate(["home"])
      .then(() => {
        window.location.reload();
      })

    // window.location.href = 'http://localhost:4200/home'
  }
}


