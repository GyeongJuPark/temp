import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LeaderWorkInfo } from '../../models/leaderWorkInfo.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  displayedColumns: string[] = ['select', 'index', 'code', 'name', 'sport', 'school', 'detail'];
  dataSource = new MatTableDataSource<LeaderWorkInfo>();
  
  // 전체 데이터
  leaderList: LeaderWorkInfo[] = [];
  // 검색 데이터
  filteredLeaderList: LeaderWorkInfo[] = [];

  selection = new SelectionModel<LeaderWorkInfo>(true, []);

  searchInput: string = '';
  selectedSearchOption: string = '전체';

  isDeleteButtonActive: boolean = false;

  currentPage = 1;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
  }

  constructor(
    private routes: Router,
    private el: ElementRef,
    private renderer: Renderer2,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.commonService.getLeaderList().subscribe({
      next: (leaders) => {
        this.leaderList = leaders;
        this.updateData();
      },
    });
  }

  getPages(): number[] {
    let dataList: LeaderWorkInfo[] = this.leaderList;

    if (this.searchInput && this.filteredLeaderList.length > 0) {
      dataList = this.filteredLeaderList;
    }

    const totalPages = Math.ceil(dataList.length / this.pageSize);
    const startPage = Math.floor((this.currentPage - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }


  changePage(page: number): void {
    this.currentPage = page;
    this.updateData();
  }
  isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  isLastPage(): boolean {
    const dataList: LeaderWorkInfo[] = this.searchInput ? this.filteredLeaderList : this.leaderList;
    const totalPages = Math.ceil(dataList.length / this.pageSize);
    return this.currentPage === totalPages;
  }

  goToFirstPage(): void {
    this.currentPage = 1;
    this.updateData();
  }

  goToPreviousPage(): void {
    if (!this.isFirstPage()) {
      this.currentPage--;
      this.updateData();
    }
  }

  goToNextPage(): void {
    if (!this.isLastPage()) {
      this.currentPage++;
      this.updateData();
    }
  }

  goToLastPage(): void {
    const totalPages = Math.ceil(this.leaderList.length / this.pageSize);
    this.currentPage = totalPages;
    this.updateData();
  }

  updateData(): void {
    const dataList: LeaderWorkInfo[] = this.searchInput ? this.filteredLeaderList : this.leaderList;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource.data = dataList.slice(startIndex, endIndex);
  }

  // 검색
  filterData() {
    const searchTerm = this.searchInput.trim();

    switch (this.selectedSearchOption) {
      case '이름':
        this.filteredLeaderList = this.leaderList.filter(leader => leader.leaderName.includes(searchTerm));
        break;
      case '종목':
        this.filteredLeaderList = this.leaderList.filter(leader => leader.sportsName.includes(searchTerm));
        break;
      default:
        this.filteredLeaderList = this.leaderList.filter(
          leader => leader.leaderName.includes(searchTerm) ||
            leader.sportsName.includes(searchTerm) ||
            leader.leaderNo.includes(searchTerm) ||
            leader.schoolName.includes(searchTerm)
        );
        break;
    }

    this.currentPage = 1;

    if (this.filteredLeaderList.length === 0) {
      this.filteredLeaderList.push({
        leaderNo: '',
        leaderName: '등록된 지도자가 없습니다. 지도자를 등록해주세요.',
        sportsName: '',
        schoolName: '',
        leaderImage: '',
        birthday: '',
        gender: '',
        sportsNo: '',
        schoolNo: '',
        telNo: '',
        telNo2: '',
        telNo3: '',
        empDT: '',
        histories: [],
        certificates: []
      });

      this.displayedColumns = ['code', 'name', 'sport', 'school'];
    } else {
      this.displayedColumns = ['select', 'index', 'code', 'name', 'sport', 'school', 'detail'];
    }

    this.updateData();
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
      console.error('해당 지도자를 찾을 수 없습니다.');
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

  onDeleteLeader() {
    const selectedLeaderIds = this.selection.selected.map(leader => leader.leaderNo);

    this.commonService.delLeader(selectedLeaderIds)
      .subscribe({
        next: (response) => {
          this.leaderList = this.leaderList.filter(leader => !selectedLeaderIds.includes(leader.leaderNo));

          this.updateData();

          this.selection.clear();

          const totalPages = Math.ceil(this.leaderList.length / this.pageSize);
          if (this.currentPage > totalPages) {
            this.currentPage = totalPages;
            this.updateData();
          }
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        }
      });
  }
}