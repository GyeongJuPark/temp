import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaderWorkInfo } from '../../models/leaderWorkInfo.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  baseUrl: string = 'https://localhost:7265'

  getLeaderList(): Observable<LeaderWorkInfo[]> {
    return this.http.get<LeaderWorkInfo[]>(this.baseUrl + '/api/leaders/list')
  }
}
