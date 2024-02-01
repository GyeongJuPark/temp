import { Component } from '@angular/core';
import { SmallModalComponent } from '../../shared/small-modal/small-modal.component';
import { LargeModalComponent } from '../../shared/large-modal/large-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Leader } from '../../models/leader.model';
import { School } from '../../models/school.model';
import { Sport } from '../../models/sport.model';
import { CommonService } from '../common.service';
import { LeaderWorkInfo } from '../../models/leaderWorkInfo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['../register/register.component.css', './update.component.css']
})
export class UpdateComponent {

  selectedLeader: any;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private routes: Router
  ) {
    this.leaderNo = this.route.snapshot.params['leaderNo'];
  }

  private readonly leaderNo: string;

  leaders: Leader[] = [];
  schools: School[] = [];
  sports: Sport[] = [];

  validationErrors: any[] = [];

  leaderData: LeaderWorkInfo[] = [];

  // 초기화
  ngOnInit(): void {
    this.commonService.getLeaderList()
      .subscribe({
        next: (leaders) => {
          this.leaderData = leaders;
          this.selectedLeader = this.leaderData.find(leader => leader.leaderNo === this.leaderNo);

          const telNoParts = this.selectedLeader.telNo.split('-');
          this.selectedLeader.telNo = telNoParts[0];
          this.selectedLeader.telNo2 = telNoParts[1];
          this.selectedLeader.telNo3 = telNoParts[2];

          // this.selectedLeader.birthday = this.formatDate(this.selectedLeader.birthday);
          // this.selectedLeader.empDT = this.formatDate(this.selectedLeader.empDT);
          
          console.log(`birthday: ${this.selectedLeader.birthday}`);



          this.selectedLeader.histories.forEach((history: { startDT: string | Date; endDT: string | Date; }) => {
            history.startDT = this.formatDate(new Date(history.startDT));
            history.endDT = this.formatDate(new Date(history.endDT));
          });

          this.selectedLeader.certificates.forEach(((certificate: { certificateDT: string | Date; }) => {
            certificate.certificateDT = this.formatDate(new Date(certificate.certificateDT))
          }));
        }
      });


    this.commonService.getAllLeaders()
      .subscribe({
        next: (leaders) => {
          this.leaders = leaders;
        },
      });

    this.commonService.getAllSchools()
      .subscribe({
        next: (schools) => {
          this.schools = schools;
        },
      });

    this.commonService.getAllSports()
      .subscribe({
        next: (sports) => {
          this.sports = sports;
        },
      });
  }

  test() {
    console.log(this.selectedLeader.birthday);
    console.log(this.selectedLeader.empDT);
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }



  removeWorkHistory(index: number) {
    this.selectedLeader.histories.splice(index, 1);
  }
  removeCertificate(index: number) {
    this.selectedLeader.certificates.splice(index, 1);
  }

  // 근무이력 테이블 행 추가
  addWorkHistory(): void {
    // 새로운 이력 생성
    const newHistoryRow = {
      leaderNo: this.selectedLeader.leaderNo,
      startDT: new Date(),
      endDT: new Date(),
      schoolName: '',
      sportsNo: '',
      sportsName: '',
    };

    // 유효성 검사
    if (newHistoryRow.endDT < newHistoryRow.startDT) {
      alert("[근무종료일] : 근무종료일이 근무시작일보다 빠를 수 없습니다.");
      return;
    }

    // 기존 이력들에 대해서도 유효성 검사
    for (const history of this.selectedLeader.histories) {
      if (!history.schoolName) {
        alert("[근무기관] : 근무기관을 입력해주세요.");
        return;
      }

      if (!history.startDT) {
        alert("[근무시작일] : 근무시작일을 선택해주세요.");
        return;
      }

      if (!history.endDT) {
        alert("[근무종료일] : 근무종료일을 선택해주세요.");
        return;
      }

      if (history.endDT < history.startDT) {
        alert("[근무종료일] : 근무종료일이 근무시작일보다 빠를 수 없습니다.");
        return;
      }

      if (!history.sportsNo) {
        alert("[근무종목] : 근무종목을 선택해주세요.")
        return;
      }
    }
    this.selectedLeader.histories.push(newHistoryRow);
  }

  // 자격사항 테이블 행 추가
  addCertificate(): void {
    const newCertificateRow = {
      leaderNo: this.selectedLeader.leaderNo,
      certificateName: '',
      certificateNo: '',
      certificateDT: new Date(),
      organization: '',
    };

    for (const certificate of this.selectedLeader.certificates) {
      if (!certificate.certificateName) {
        console.warn("자격/면허를 입력해주세요.");
        return;
      }

      if (!certificate.certificateNo) {
        console.warn("자격번호를 입력해주세요.");
        return;
      }

      if (!certificate.certificateDT) {
        console.warn("취득일자를 선택해주세요.");
        return;
      }

      if (!certificate.organization) {
        console.warn("발급기관을 입력해주세요.");
        return;
      }
    }

    this.selectedLeader.certificates.push(newCertificateRow);
  }

  // 식별코드, 학교명 모달창
  openLargeModal(buttonType: string) {
    const dialogRef = this.dialog.open(LargeModalComponent, {
      data: { dynamicContent: buttonType, leaders: this.leaders, schools: this.schools }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (buttonType === 'LeaderData' && result && result.leader) {
        this.selectedLeader.leaderNo = result.leader.leaderNo;
        this.selectedLeader.leaderName = result.leader.leaderName;

      } else if (buttonType === 'SchoolData' && result && result.school) {
        this.selectedLeader.schoolNo = result.school.schoolNo;
        this.selectedLeader.schoolName = result.school.schoolName;
      }
    });
  }

  // 유효성 검사, 등록, 취소, 수정 ···
  openSmallModal(buttonType: string) {
    const dialogRef = this.dialog.open(SmallModalComponent, {
      data: { dynamicContent: buttonType, leaderNo: this.selectedLeader.leaderNo }
    });

  }

  // 이미지 크기 검사
  base64ImageData: string = '';

  imageSizeCheck(event: any): void {
    const fileInput = event.target;
    const selectedImage = document.getElementById("img") as HTMLImageElement;
    const maxSizeInBytes = 4 * 1024 * 1024;

    const selectedFiles = fileInput?.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const imageFile = selectedFiles[0];

      if (imageFile.size > maxSizeInBytes) {
        alert("이미지 크기는 4MB 이하이어야 합니다.");
        fileInput.value = "";
        return;
      }

      const fileReader = new FileReader();

      fileReader.onload = () => {
        const srcData = fileReader.result;

        if (srcData) {
          selectedImage.src = srcData as string;
          this.selectedLeader.leaderImage = (srcData as string).split(",")[1];
        }
      };


      fileReader.readAsDataURL(imageFile);
    }
  }

  formatDateTime(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss') || '';
  }


  // 지도자 수정
  onFormSubmit() {
    console.log(`birthdaycheck: ${this.selectedLeader.birthday}`);
    // this.selectedLeader.birthday = this.formatDate(this.selectedLeader.birthday);
    // console.log(`birthdayConvert: ${this.selectedLeader.birthday}`);
    this.selectedLeader.birthday = this.selectedLeader.birthday
    ? this.formatDate(this.selectedLeader.birthday)
    : undefined;
    this.commonService.modLeader(this.selectedLeader)
      .subscribe({
        next: (response) => {
          this.routes.navigate(['home/detail', this.selectedLeader.leaderNo]);
        },
        error: (error) => {
          if (error.error && Array.isArray(error.error)) {
            this.validationErrors = error.error;
            console.log("validationErrors: ", this.validationErrors);

          } else {
            console.error(error);
          }
        }
      });
  }

  // 등록 실패 시 해당 프로퍼티 에러메시지
  getValidationError(propertyName: string): string | undefined {
    return this.validationErrors.find(error => error.propertyName === propertyName)?.errorMessage;
  }

}
