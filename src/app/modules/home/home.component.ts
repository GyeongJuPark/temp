import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private routes: Router, private el: ElementRef, private renderer: Renderer2) { }

  goToRegisterPage() :void {
    this.routes.navigate(['home/register']);
  }

  CustomDropdown(): void {
    const btn = this.el.nativeElement.querySelector('.btn-select');
    const list = this.el.nativeElement.querySelector('.list-member');

    this.renderer.listen(btn, 'click', () => {
      btn.classList.toggle('on');
    })

    this.renderer.listen(list, 'click', (event) => {
      if (event.target.nodeName === 'BUTTON') {
        this.renderer.setProperty(btn, 'innerText', event.target.innerText);
        btn.classList.remove('on');
      }
    });
  }
}
