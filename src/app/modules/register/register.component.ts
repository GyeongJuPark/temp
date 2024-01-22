import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LargeModalComponent } from '../../shared/large-modal/large-modal.component';
import { SmallModalComponent } from '../../shared/small-modal/small-modal.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {

  constructor(private dialog: MatDialog) { }

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
