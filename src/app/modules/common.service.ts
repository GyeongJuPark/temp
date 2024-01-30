import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Leader } from '../models/leader.model';
import { School } from '../models/school.model';
import { Sport } from '../models/sport.model';
import { LeaderWorkInfo } from '../models/leaderWorkInfo.model';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  baseUrl: string = 'https://localhost:7265'


  // 지도자
  getAllLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(this.baseUrl + '/api/leaders');
  }

  // 지도자 전체
  getLeaderList(): Observable<LeaderWorkInfo[]> {
    return this.http.get<LeaderWorkInfo[]>(this.baseUrl + '/api/leaders/list')
  }

  // 학교
  getAllSchools(): Observable<School[]> {
    return this.http.get<School[]>(this.baseUrl + '/api/schools');
  }

  // 종목
  getAllSports(): Observable<Sport[]> {
    return this.http.get<Sport[]>(this.baseUrl + '/api/sports');
  }

  // 지도자 등록
  addLeader(model: LeaderWorkInfo): Observable<void> {
    const url = `${this.baseUrl}/api/leaders`;
    return this.http.post<void>(url, model);
  }

  // 지도자 삭제
  delLeader(leaderNo: string[]): Observable<void> {
    const url = `${this.baseUrl}/api/leaders`;
    return this.http.delete<void>(url, { body: leaderNo });
  }

  modLeader(model: LeaderWorkInfo): Observable<void> {
    const url = `${this.baseUrl}/api/leaders`;
    return this.http.patch<void>(url, model);
  }

}

