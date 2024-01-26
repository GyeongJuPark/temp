import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LeaderWorkInfo } from '../../models/leaderWorkInfo.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonService } from '../common.service';
import { state } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  displayedColumns: string[] = ['select', 'index', 'code', 'name', 'sport', 'school', 'detail'];
  dataSource = new MatTableDataSource<LeaderWorkInfo>();

  leaderList: LeaderWorkInfo[] = [];
  selection = new SelectionModel<LeaderWorkInfo>(true, []);

  searchInput: string = '';
  selectedSearchOption: string = '전체';

  isDeleteButtonActive: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private routes: Router,
    private el: ElementRef,
    private renderer: Renderer2,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.commonService.getLeaderList()
      .subscribe({
        next: (leaders) => {
          this.leaderList = leaders;
          this.dataSource.data = this.leaderList;
        },
      });
  }

  filterData() {
    const searchTerm = this.searchInput.trim().toLowerCase();

    let filteredData = [];
    switch (this.selectedSearchOption) {
      case '이름':
        filteredData = this.leaderList.filter(leader => leader.leaderName.toLowerCase().includes(searchTerm));
        break;
      case '종목':
        filteredData = this.leaderList.filter(leader => leader.sportsNo.includes(searchTerm));
        break;
      default:
        filteredData = this.leaderList.filter(
          leader => leader.leaderName.toLowerCase().includes(searchTerm) ||
            leader.sportsNo.includes(searchTerm) ||
            leader.leaderNo.includes(searchTerm) ||
            leader.schoolNo.includes(searchTerm)
        );
        break;
    }

    this.dataSource.data = filteredData;
    this.paginator.firstPage();
  }

  selectSearchOption(option: string) {
    this.selectedSearchOption = option;
    this.searchInput = '';
  }

  goToRegisterPage(): void {
    this.routes.navigate(['home/register']);
  }

  goToDetailPage(leaderId: string): void {
    const selectedLeader = this.leaderList.find(leader => leader.leaderNo === leaderId);
    if (selectedLeader) {
      this.routes.navigate(['home/detail', selectedLeader.leaderNo]);
    } else {
      console.error('Leader not found');
    }
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }

    this.isDeleteButtonActive = this.selection.hasValue();
  }

  selectionToggle(row: LeaderWorkInfo) {
    this.selection.toggle(row);
    this.isDeleteButtonActive = this.selection.hasValue();
  }


  checkboxLabel(row?: LeaderWorkInfo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.leaderNo + 1}`;
  }

  getPages(): number[] {
    // dataSource.data 배열의 길이를 페이지데이터 수로 나누어 전체 페이지 수를 계산
    const totalPages = Math.ceil(this.dataSource.data.length / this.paginator.pageSize);

    // 페이지 수만큼의 배열을 생성, 각 요소에 1부터 시작하는 페이지 번호 할당
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  changePage(page: number): void {
    this.paginator.pageIndex = page - 1;
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
