import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../common.service';
import { LeaderWorkInfo } from '../../models/leaderWorkInfo.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: [
    './detail.component.css',
    '../register/register.component.css'
  ]
})
export class DetailComponent implements OnInit {

  private readonly leaderNo: string;
  leaderData: LeaderWorkInfo[] = [];
  selectedLeader: any;
  constructor(
    private routes: Router,
    private route: ActivatedRoute,
    private commonServie: CommonService
  ) {

    this.leaderNo = this.route.snapshot.params['leaderNo'];
  }

  ngOnInit(): void {
    this.commonServie.getLeaderList()
      .subscribe({
        next: (leaders) => {
          this.leaderData = leaders;
          this.selectedLeader = this.leaderData.find(leader => leader.leaderNo === this.leaderNo);
          console.log(this.selectedLeader)
        }
      });
  }

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
