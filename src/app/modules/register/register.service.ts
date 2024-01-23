import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Leader } from '../../models/leader.model';
import { School } from '../../models/school.model';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  baseUrl: string = 'http://localhost:5051'

  getAllLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(this.baseUrl + '/api/leaders'); 
  }

  getAllSchools(): Observable<School[]> {
    return this.http.get<School[]>(this.baseUrl + '/api/schools'); 
  }
}
