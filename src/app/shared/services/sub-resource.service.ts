import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs/Rx';
import { retry, catchError } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Resource } from '../models/resource';
import { Serializer } from '../models/serializer';
import { QueryOptions } from '../models/queryoptions';

@Injectable()
export class SubResourceService<T extends Resource> {
  constructor(
    private httpClient: HttpClient,
    private url: string,
    private parentEndpoint: string,
    private endpoint: string,
    private serializer: Serializer) {  }

  public create(item: T): Observable<T> {
  return this.httpClient
    .post<T>(`${this.url}/${this.parentEndpoint}/${item.parentId}/${this.endpoint}`,
      this.serializer.fromJson(item))
    .map((data: any) => this.serializer.fromJson(data) as T)
    .pipe(retry(3),catchError(this.handleError));
  }

  public update(item: T): Observable<T> {
    return this.httpClient
      .put<T>(`${this.url}/${this.parentEndpoint}/${item.parentId}/${this.endpoint}/${item.id}`,
        this.serializer.toJson(item))
      .map((data: any) => this.serializer.fromJson(data) as T)
      .pipe(retry(3),catchError(this.handleError));
  }

  read(parentId: number, id: number): Observable<T> {
    return this.httpClient
      .get(`${this.url}/${this.parentEndpoint}/${parentId}/${this.endpoint}/${id}`)
      .map((data: any) => this.serializer.fromJson(data) as T)
      .pipe(retry(3),catchError(this.handleError));
  }

  list(parentId: number, queryOptions: QueryOptions): Observable<T[]> {
    return this.httpClient
      .get(`${this.url}/${this.parentEndpoint}/${parentId}/${this.endpoint}?${queryOptions.toQueryString()}`)
      .map((data: any) => this.convertData(data.items))
      .pipe(retry(3),catchError(this.handleError));
  }

  delete(parentId: number, id: number) {
    return this.httpClient
      .delete(`${this.url}/${this.parentEndpoint}/${parentId}/${this.endpoint}/${id}`)
      .pipe(retry(3),catchError(this.handleError));
  }

  private convertData(data: any): T[] {
    return data.map(item => this.serializer.fromJson(item));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Error occurred. Please try again later.');
  };
}
