import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { NotificationService } from "./notification.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private notificationService = inject(NotificationService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        console.error(err);
        this.notificationService.send({
          id: "",
          message:
            "Something went wrong on server side, please contact to admin!",
          severity: "error",
        });
        //  this.handleServerSideError(err);
        return throwError(() => err);
      })
    );
  }

  // private handleServerSideError = (error: HttpErrorResponse) => {

  //   console.log(error);

  //   switch (error.status) {
  //     case 400:
  //       console.log("400 Bad Request, please try again later .");
  //       break;
  //     case 401:
  //       console.log("401 Unauthorized, please try again later.");
  //       break;
  //     case 403:
  //       console.log("403 Forbidden access is denied");
  //       break;
  //     case 404:
  //       console.log("404 resource not found");
  //       break;
  //     case 500:
  //       console.log("500 Internal server error, please try again later.");
  //       break;
  //   }
  // };
}
