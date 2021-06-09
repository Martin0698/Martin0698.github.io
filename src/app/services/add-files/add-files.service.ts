import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddFilesService {

  baseUrl = 'http://150.136.136.104:8080';

  constructor(private http: HttpClient) {}

  addFile(files: FormData): Observable<any> {
    const url = `${this.baseUrl}/api/upload/`;
    return this.http.post<any>(url, files);
  }

  addFileManually(files: FormData): Observable<any> {
    const url = `${this.baseUrl}/api/upload_man/`;
    return this.http.post<any>(url, files);
  }

}
