import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        this.handleServerSideError(err);
        return throwError(() => err);
      })
    );
  }

  private handleServerSideError = (error: HttpErrorResponse) => {
    // console.log(error);
    switch (error.status) {
      case 400:
        console.log("400 Bad Request, please try again later .");
        break;
      case 401:
        console.log("401 Unauthorized, please try again later.");
        break;
      case 403:
        console.log("403 Forbidden access is denied");
        break;
      case 404:
        console.log("404 Resource not found");
        break;
      case 500:
        console.log("500 Internal server error, please try again later.");
        break;
    }
  };
}
