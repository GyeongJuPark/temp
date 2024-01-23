import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { LeaderWorkInfo } from '../../models/leaderWorkInfo.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  leaderList: LeaderWorkInfo[] = [];

  constructor(
    private routes: Router,
    private el: ElementRef,
    private renderer: Renderer2,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
    this.homeService.getLeaderList()
      .subscribe({
        next: (leaders) => {
          this.leaderList = leaders;
          console.log(this.leaderList);
        },
      });
  }

  goToRegisterPage(): void {
    this.routes.navigate(['home/register']);
  }

  goToDetailPage(leaderId: string): void {
    this.routes.navigate(['home/detail'], { queryParams: { id: leaderId } });
  }

  CustomDropdown(): void {
    const btn = this.el.nativeElement.querySelector('.btn-select');
    const list = this.el.nativeElement.querySelector('.list-member');

    this.renderer.listen(btn, 'click', () => {
      btn.classList.toggle('on');
    });

    this.renderer.listen(list, 'click', (event) => {
      if (event.target.nodeName === 'BUTTON') {
        this.renderer.setProperty(btn, 'innerText', event.target.innerText);
        btn.classList.remove('on');
      }
    });
  }
}
