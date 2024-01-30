import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LargeModalComponent } from '../../shared/large-modal/large-modal.component';
import { SmallModalComponent } from '../../shared/small-modal/small-modal.component';
import { Leader } from '../../models/leader.model';
import { School } from '../../models/school.model';
import { Sport } from '../../models/sport.model';
import { CommonService } from '../common.service';
import { LeaderWorkInfo } from '../../models/leaderWorkInfo.model';
import { MAT_SORT_HEADER_INTL_PROVIDER_FACTORY } from '@angular/material/sort';

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
      // 수정할 필요가 있어 보임(sportsName)
      histories: [{
        leaderNo: '',
        schoolName: '',
        startDT: new Date(),
        endDT: new Date(),
        sportsNo: '',
        sportsName: '',
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
          console.log(certificate.leaderNo);

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
    if (buttonType === 'register') {
      dialogRef.componentInstance.onConfirm.subscribe(() => {
        this.onFormSubmit();
      });
    }
  }

  // 근무이력 테이블 행 추가
  addWorkHistory(): void {
    const newHistoryRow = {
      leaderNo: this.model.leaderNo,
      startDT: new Date(),
      endDT: new Date(),
      schoolName: '',
      sportsNo: '',
      sportsName: '',
    };

    this.model.histories.push(newHistoryRow);
  }

  // 자격사항 테이블 행 추가
  addCertificate(): void {
    const newCertificateRow = {
      leaderNo: this.model.leaderNo,
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
          this.model.leaderImage = (srcData as string).split(",")[1];
        }
      };

      fileReader.readAsDataURL(imageFile);
    }
  }

  onFormSubmit() {
    if (this.validation()) {
      this.commonService.addLeader(this.model)
        .subscribe({
          next: (response) => {
            console.log("등록 성공", response);

          },
          error: (error) => {
            console.error(error);
          }
        });
    }
  }


  // 유효성 검사
  validation(): boolean {
    // 정규식
    const telNoRegex = /^[0-9]{3}$/;
    const leaderCodeRegex = /^JB[0-9]{2}[-]+[0-9]{3}$/;
    const schoolCodeRegex = /^SC[0-9]{4}$/;
    const koreanEnglishRegex = /^[가-힣a-zA-Z]+$/;
    const dateRegex = /^[0-9]{4}[-]+[0-9]{2}[-]+[0-9]{2}$/;
    const certificateName = /^[가-힣a-zA-Z0-9]+$/;
    const certificateNo = /^[a-zA-Z0-9]+$/;

    if (!leaderCodeRegex.test(this.model.leaderNo)) {
      alert("[식별코드] : 식별코드를 입력해주세요.( ex) JB19-???(? -> 숫자 1~9) ");
      return false;
    }

    if (!schoolCodeRegex.test(this.model.schoolNo)) {
      alert("[학교명] : 잘못된 학교 식별코드 형태입니다.( ex) SC????(? -> 숫자 1~9");
      return false;
    }

    if (!koreanEnglishRegex.test(this.model.leaderName)) {
      alert("[성명] : 한글 및 영어만 입력해주세요.");
      return false;
    }

    if (!telNoRegex.test(this.model.telNo) || !telNoRegex.test(this.model.telNo2) || !/^[0-9]{4}$/.test(this.model.telNo3)) {
      alert("[근무지 전화번호] : ex) 123 - 456 - 1234 형태로 입력해주세요.(3자리 - 3자리 - 4자리)")
      return false;
    }

    if (!dateRegex.test(this.model.birthday)) {
      alert("[생년월일] : 생년월일을 입력해주세요.(yyyy-MM-dd)")
      return false;
    }

    if (!dateRegex.test(this.model.empDT)) {
      alert("[최초채용일] : 최초채용일을 입력해주세요.(yyyy-MM-dd)")
    }

    if (this.model.gender.length === 0) {
      alert("[성별] : 성별을 선택해주세요.")
      return false;
    }

    if (!this.model.sportsNo) {
      alert("[종목] : 종목을 선택해주세요.");
      return false;
    }

    // 근무이력 유효성 검사

    

    // 자격사항 유효성 검사
    


    return true;
  }
}
