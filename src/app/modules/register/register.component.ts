import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LargeModalComponent } from '../../shared/large-modal/large-modal.component';
import { SmallModalComponent } from '../../shared/small-modal/small-modal.component';
import { Leader } from '../../models/leader.model';
import { RegisterService } from './register.service';
import { School } from '../../models/school.model';
import { Sport } from '../../models/sport.model';

interface WorkHistoryItem {
  schoolName: string;
  startDT: Date | null;
  endDT: Date | null;
  sportsNo: string;
}

interface CertificateItem {
  schoolName: string;
  startDT: Date | null;
  endDT: Date | null;
  sportsNo: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {

  leaders: Leader[] = [];
  schools: School[] = [];
  sports: Sport[] = [];

  constructor(private dialog: MatDialog, private registerService: RegisterService) { }

  ngOnInit(): void {
    this.registerService.getAllLeaders()
      .subscribe({
        next: (leaders) => {
          this.leaders = leaders;
        },
      });

    this.registerService.getAllSchools() 
      .subscribe({
        next: (schools) => {
          this.schools = schools;
        },
      });

      this.registerService.getAllSports() 
      .subscribe({
        next: (sports) => {
          this.sports = sports;
        },
      });
  }

  // 근무이력 기본값 초기화
  workHistoryList: WorkHistoryItem[] = [
    {
      schoolName: '',
      startDT: null,
      endDT: null,
      sportsNo: ''
    }
  ];

  // 자격사항 기본값 초기화
  certificateList: CertificateItem[] = [{
    schoolName: '',
    startDT: null,
    endDT: null,
    sportsNo: ''
  }];

  removeWorkHistory(index: number) {
    this.workHistoryList.splice(index, 1);
  }
  removeCertificate(index: number) {
    this.certificateList.splice(index, 1);
  }

  addWorkHistory() {
    const newWorkHistory = {
      schoolName: '',
      startDT: null,
      endDT: null,
      sportsNo: ''
    };
    this.workHistoryList.push(newWorkHistory);
  }

  addCertificate() {
    const newCertificate = {
      schoolName: '',
      startDT: null,
      endDT: null,
      sportsNo: ''
    };
    this.certificateList.push(newCertificate);
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
      data: { dynamicContent: buttonType}
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
          this.base64ImageData = (srcData as string).split(",")[1];
        }
      };

      fileReader.readAsDataURL(imageFile);
    }
  }

}
