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

  leaderList: LeaderWorkInfo[] = [];
  selection = new SelectionModel<LeaderWorkInfo>(true, []);

  searchInput: string = '';
  selectedSearchOption: string = '전체';

  isDeleteButtonActive: boolean = false;

  currentPage = 1;
  pageSize = 10;

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
    this.commonService.getLeaderList().subscribe({
      next: (leaders) => {
        this.leaderList = leaders;
        this.updateDataSource();
      },
    });
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.leaderList.length / this.pageSize);
    const startPage = Math.floor((this.currentPage - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);
    console.log("totalpage:", totalPages);
    console.log("startPage:", startPage);
    console.log("endPage:", endPage);
    
    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }


  changePage(page: number): void {
    this.currentPage = page;
    this.updateDataSource();
  }

  isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  isLastPage(): boolean {
    const totalPages = Math.ceil(this.leaderList.length / this.pageSize);
    return this.currentPage === totalPages;
  }

  goToFirstPage(): void {
    this.currentPage = 1;
    this.updateDataSource();
  }

  goToPreviousPage(): void {
    if (!this.isFirstPage()) {
      this.currentPage--;
      this.updateDataSource();
    }
  }

  goToNextPage(): void {
    if (!this.isLastPage()) {
      this.currentPage++;
      this.updateDataSource();
    }
  }

  goToLastPage(): void {
    const totalPages = Math.ceil(this.leaderList.length / this.pageSize);
    this.currentPage = totalPages;
    this.updateDataSource();
  }

  updateDataSource(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource.data = this.leaderList.slice(startIndex, endIndex);
  }

  filterData() {
    const searchTerm = this.searchInput.trim();

    let filteredData = [];
    switch (this.selectedSearchOption) {
      case '이름':
        filteredData = this.leaderList.filter(leader => leader.leaderName.includes(searchTerm));
        break;
      case '종목':
        filteredData = this.leaderList.filter(leader => leader.sportsNo.includes(searchTerm));
        break;
      default:
        filteredData = this.leaderList.filter(
          leader => leader.leaderName.includes(searchTerm) ||
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

  onDeleteLeader() {
    // 1. 선택한 체크박스의 LeaderNo 값을 가져온다.
    const selectedLeaderIds = this.selection.selected.map(leader => leader.leaderNo);

    // 2. 가져온 LeaderNo 값을 가진 데이터를 삭제한다.
    this.commonService.delLeader(selectedLeaderIds)
      .subscribe({
        next: (response) => {
          // 3. 성공적으로 삭제되었으면, 삭제된 데이터를 leaderList에서 제거한다.
          this.leaderList = this.leaderList.filter(leader => !selectedLeaderIds.includes(leader.leaderNo));

          // 4. 업데이트된 데이터를 테이블에 반영한다.
          this.updateDataSource();

          // 5. 선택한 체크박스를 초기화한다.
          this.selection.clear();

          // 6. 삭제 버튼 비활성화
          this.isDeleteButtonActive = false;

          console.log(response);
        },
        error: (error) => {
          console.error(error);
        }
      });
  }


}
