export interface LeaderWorkInfo {
    leaderNo: string;
    leaderImage: string;
    leaderName: string;
    birthday: string;
    gender: string;
    sportsNo: string;
    schoolNo: string;
    schoolName: string;
    telNo: string;
    telNo2: string;
    telNo3: string;
    empDT: string;
    histories: Array<{
        leaderNo: string;
        startDT: Date;
        endDT: Date;
        schoolName: string;
        sportsNo: string;
    }>;
    certificates: Array<{
        leaderNo: string;
        certificateName: string;
        certificateNo: string;
        certificateDT: Date;
        organization: string;
    }>;
}
