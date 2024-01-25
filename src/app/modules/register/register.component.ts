import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LargeModalComponent } from '../../shared/large-modal/large-modal.component';
import { SmallModalComponent } from '../../shared/small-modal/small-modal.component';
import { Leader } from '../../models/leader.model';
import { School } from '../../models/school.model';
import { Sport } from '../../models/sport.model';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {
  
  leaders: Leader[] = [];
  schools: School[] = [];
  sports: Sport[] = [];

  // 근무 이력 배열
  workHistoryList: any[] = [{
    schoolName: '',
    startDate: '',
    endDate: '',
    sports: ''
  }];

  // 자격 사항 배열
  certificateList: {
    certificateName: string,
    certificateNo: string,
    certificateDT: string,
    organization: string
  }[] = [{
    certificateName: '',
    certificateNo: '',
    certificateDT: '',
    organization: ''
  }];


  constructor(private dialog: MatDialog, private commonService: CommonService) { }

  // 초기화
  ngOnInit(): void {
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

  // 식별코드, 학교명 모달창
  openLargeModal(buttonType: string) {
    const dialogRef = this.dialog.open(LargeModalComponent, {
      data: { dynamicContent: buttonType, leaders: this.leaders, schools: this.schools }
    });
  }

  // 유효성 검사, 등록, 취소, 수정 ···
  openSmallModal(buttonType: string) {
    const dialogRef = this.dialog.open(SmallModalComponent, {
      data: { dynamicContent: buttonType }
    });
  }

  // 근무이력 테이블 행 추가
  addWorkHistory(): void {
    this.workHistoryList.push({
      schoolName: '',
      startDate: '',
      endDate: '',
      sports: ''
    });

  }

  // 추가된 행 삭제
  deleteWorkHistory(index: number): void {
    this.workHistoryList.splice(index, 1);
  }

  deleteCertificate(index: number): void {
    this.certificateList.splice(index, 1);
  }

  // 자격사항 테이블 행 추가
  addCertificate(): void {
    this.certificateList.push({
      certificateName: '',
      certificateNo: '',
      certificateDT: '',
      organization: ''
    })
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
          this.base64ImageData = (srcData as string).split(",")[1];
        }
      };

      fileReader.readAsDataURL(imageFile);
    }
  }

}
