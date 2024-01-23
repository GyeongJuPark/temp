import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Leader } from '../../models/leader.model';
import { School } from '../../models/school.model';
import { Sport } from '../../models/sport.model';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  baseUrl: string = 'https://localhost:7265'

  // 지도자(식별코드, 성명)
  getAllLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(this.baseUrl + '/api/leaders'); 
  }
  
  // 학교(식별코드, 학교명)
  getAllSchools(): Observable<School[]> {
    return this.http.get<School[]>(this.baseUrl + '/api/schools'); 
  }

  getAllSports(): Observable<Sport[]> {
    return this.http.get<Sport[]>(this.baseUrl + '/api/sports');
  }
}




  // getAllLeadersData(): Promise<Leader[]> {
  //   return new Promise((resolve, reject) => {
  //     this.http.get<Leader[]>(this.baseUrl + '/api/leaders')
  //     .subscribe((response: any) => {
  //       resolve(response);
  //     });
  //   });    
  // }