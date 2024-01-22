import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: [
    './detail.component.css',
    '../register/register.component.css'
  ]
})
export class DetailComponent {

  constructor(private routes: Router) {  }

  goToIndexPage(): void {
    this.routes.navigate(["home"]);
  }

  goToUpdatePage(): void {
    this.routes.navigate(["home/update"])
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
