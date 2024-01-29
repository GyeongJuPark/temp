import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LargeModalComponent } from '../../shared/large-modal/large-modal.component';
import { SmallModalComponent } from '../../shared/small-modal/small-modal.component';
import { Leader } from '../../models/leader.model';
import { School } from '../../models/school.model';
import { Sport } from '../../models/sport.model';
import { CommonService } from '../common.service';
import { LeaderWorkInfo } from '../../models/leaderWorkInfo.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {

  leaders: Leader[] = [];
  schools: School[] = [];
  sports: Sport[] = [];

  model: LeaderWorkInfo;

  constructor(private dialog: MatDialog, private commonService: CommonService) {
    this.model = {
      leaderNo: '',
      leaderImage: '',
      leaderName: '',
      birthday: '',
      gender: '',
      sportsNo: '',
      schoolNo: '',
      schoolName: '',
      telNo: '',
      telNo2: '',
      telNo3: '',
      empDT: '',
      histories: [{
        leaderNo: '',
        schoolName: '',
        startDT: new Date(),
        endDT: new Date(),
        sportsNo: '',
      }],
      certificates: [{
        leaderNo: '',
        certificateName: '',
        certificateNo: '',
        certificateDT: new Date(),
        organization: '',
      }],
    };
  }

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

    dialogRef.afterClosed().subscribe(result => {
      if (buttonType === 'LeaderData' && result && result.leader) {
        this.model.leaderNo = result.leader.leaderNo;
        this.model.leaderName = result.leader.leaderName;

        this.model.histories.forEach(history => {
          history.leaderNo = result.leader.leaderNo;
        });

        this.model.certificates.forEach(certificate => {
          certificate.leaderNo = result.leader.leaderNo;
        });
      } else if (buttonType === 'SchoolData' && result && result.school) {
        this.model.schoolNo = result.school.schoolNo;
        this.model.schoolName = result.school.schoolName;
      }
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
    const newHistoryRow = {
      leaderNo: this.model.leaderNo, // Set leaderNo for the new row
      startDT: new Date(),
      endDT: new Date(),
      schoolName: '',
      sportsNo: '',
    };

    this.model.histories.push(newHistoryRow);
  }

  // 자격사항 테이블 행 추가
  addCertificate(): void {
    const newCertificateRow = {
      leaderNo: this.model.leaderNo, // Set leaderNo for the new row
      certificateName: '',
      certificateNo: '',
      certificateDT: new Date(),
      organization: '',
    };

    this.model.certificates.push(newCertificateRow);
  }

  // 추가된 행 삭제
  deleteWorkHistory(index: number): void {
    this.model.histories.splice(index, 1);
  }

  deleteCertificate(index: number): void {
    this.model.certificates.splice(index, 1);
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
          // this.base64ImageData = (srcData as string).split(",")[1];
          this.model.leaderImage = (srcData as string).split(",")[1];
        }
      };

      fileReader.readAsDataURL(imageFile);
    }
  }

  onFormSubmit() {
    this.commonService.addLeader(this.model)
      .subscribe({
        next: (response) => {
          console.log(this.model);
          console.log(response)
        }
      })
  }

  // 유효성 검사
  validation(): boolean {

    return true;
  }
}
