import { Component } from '@angular/core';
import { SmallModalComponent } from '../../shared/small-modal/small-modal.component';
import { LargeModalComponent } from '../../shared/large-modal/large-modal.component';
import { MatDialog } from '@angular/material/dialog';

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
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrl: '../register/register.component.css'
})
export class UpdateComponent {
  constructor(private dialog: MatDialog) { }

  // 근무이력 기본값 설정
  workHistoryList: WorkHistoryItem[] = [
    {
      schoolName: '',
      startDT: null,
      endDT: null,
      sportsNo: ''
    }
  ];

  // 자격사항 기본값 설정
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
      data: { dynamicContent: buttonType }
    });
  }

  // 유효성 검사, 취소, 등록, 수정 모달창
  openSmallModal(buttonType: string) {
    const dialogRef = this.dialog.open(SmallModalComponent, {
      data: { dynamicContent: buttonType }
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
