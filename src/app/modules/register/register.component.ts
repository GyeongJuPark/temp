import { Component, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LargeModalComponent } from '../../shared/large-modal/large-modal.component';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {

  // 학교명검색 모달창
  // openSchoolModal() {
  //   const schoolModal = this.el.nativeElement.querySelector('#SchoolNameModal');

  //   this.renderer.addClass(schoolModal, 'show');
  //   this.renderer.setStyle(schoolModal, 'display', 'block');
  //   document.body.classList.add('modal-open');
  // }

  constructor(private dialog: MatDialog) { }

  openLargeModal(buttonType: string) {
    const dialogRef = this.dialog.open(LargeModalComponent, {
      data: {
        title: '제목',
        content: '내용',
        dynamicContent: buttonType
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed with result: ${result}`);
    });
  }

  // 이미지 크기 검사
  base64ImageData: string = '';
  Imagevalue: string = '';
  LeaderImage: string = '';

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
          this.Imagevalue = this.base64ImageData;
          this.LeaderImage = this.base64ImageData;
        }
      };

      fileReader.readAsDataURL(imageFile);
    }
  }
}
