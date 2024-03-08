import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class GlobalErrorHander implements ErrorHandler {
  handleError(error: any): void {
    console.log(`💩:${error}`);
  }
}
