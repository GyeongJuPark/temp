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
  styleUrls: ['../register/register.component.css', './update.component.css']
})
export class UpdateComponent {

  selectedLeader: any;

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private commonService: CommonService) {
    this.leaderNo = this.route.snapshot.params['leaderNo'];
  }

  leaders: Leader[] = [];
  schools: School[] = [];
  sports: Sport[] = [];

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
  private readonly leaderNo: string;
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

  onUpdateLeader() {
    const leaderNo = this.selectedLeader.leaderNo;
    this.commonService.modLeader(leaderNo)
    .subscribe({
      next: (response) => {
        console.log(response);
      }
    })
  }
}
