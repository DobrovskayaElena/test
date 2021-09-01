import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  url = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) {}

  getNotes() {
    return this.http.get<any>(this.url).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  postNote(data: any) {
    return this.http.post<any>(this.url, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  updateNote(data: any, id: number) {
    return this.http.put<any>(this.url + '/' + id, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  deleteNote(id: number) {
    return this.http.delete<any>(this.url + '/' + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
