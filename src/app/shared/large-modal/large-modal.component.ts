import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-large-modal',
  templateUrl: './large-modal.component.html',
  styleUrl: './large-modal.component.css'
})
export class LargeModalComponent {
  constructor(
    public dialogRef: MatDialogRef<LargeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  // 서버에서 가져온 [ 지도자, 학교 ] 전체 데이터
  orgLeaders: any[] = [];
  orgSchools: any[] = [];

  // [ 식별코드, 학교명 ] 입력값
  searchInput: string = '';

  // 초기화
  ngOnInit() {
    this.orgLeaders = [...this.data.leaders];
    this.orgSchools = [...this.data.schools];
  }

  dataSearch(): void {
    let searchResult: any[];

    if (this.data.dynamicContent === 'LeaderData') {
      searchResult = this.orgLeaders.filter(leader =>
        leader.leaderName.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        leader.leaderNo.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    } else {
      searchResult = this.orgSchools.filter(school =>
        school.schoolName.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    }

    if (searchResult.length === 0) {
      alert("일치하는 데이터가 없습니다.(추후 모달로 수정)")
    } else {
      if (this.data.dynamicContent === 'LeaderData') {
        this.data.leaders = searchResult;
      } else {
        this.data.schools = searchResult;
      }
    }
  }

  displayedLeaderColumns: string[] = ['Index', 'LeaderCode', 'LeaderName'];
  displayedSchoolColumns: string[] = ['Index', 'SchoolName'];

  selected: {
    leader: string,
    school: string
  } = {
      leader: '',
      school: ''
    };

  // 모달창 닫기
  closeDialog(): void {
    this.dialogRef.close();
  }

  isSelected(type: 'leader' | 'school', element: any): boolean {
    return type === 'leader'
      ? this.selected.leader === element
      : this.selected.school === element;

  }

  toggleSelect(type: 'leader' | 'school', element: any): void {
    this.selected[type] = this.selected[type] === element ? null : element;
  }
  
  registerData(): void {
    this.dialogRef.close(this.selected);
  }
  
}
