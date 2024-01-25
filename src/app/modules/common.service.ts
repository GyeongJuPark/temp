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



}

