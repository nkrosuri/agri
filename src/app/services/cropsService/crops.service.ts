import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CropsService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({ 'x-access-token': `${localStorage.getItem('token')}` });

  getCrops(): Observable<any> {
    return this.http.get('https://agroadvice.violetdesk.com/api/crops', { headers: this.headers });
  }

  createCrop(data: any): Observable<any> {
    return this.http.post('https://agroadvice.violetdesk.com/api/crops/create', data, { headers: this.headers });
  }

  getSingleCrop(id: any) {
    return this.http.get(`https://agroadvice.violetdesk.com/api/crops/${id}`, { headers: this.headers });
  }

  updateCrop(data: any): Observable<any> {
    return this.http.put(`https://agroadvice.violetdesk.com/api/crops/${data._id}/update`, data, { headers: this.headers });
  }

  deleteCrop(id: any): Observable<any> {
    return this.http.delete(`https://agroadvice.violetdesk.com/api/crops/${id}/delete`, { headers: this.headers });
  }

  generateForecastData(data: any) {
    return this.http.post('https://agroadvice.violetdesk.com/api/forecast/generate', data, { headers: this.headers });   
  }

}
