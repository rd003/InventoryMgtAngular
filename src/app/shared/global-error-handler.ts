import { ErrorHandler, Injectable, inject } from "@angular/core";
import { NotificationService } from "./notification.service";

@Injectable()
export class GlobalErrorHander implements ErrorHandler {
  private notificationService = inject(NotificationService);
  handleError(error: any): void {
    console.error(`💩:${error}`);
    this.notificationService.send({
      message: "Something went wrong!",
      severity: "error",
    });
  }
}
