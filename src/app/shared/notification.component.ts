import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { NotificationService } from "./notification.service";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { Notification } from "./notification.service";

@Component({
  selector: "app-notification",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor],
  styles: [
    `
      .alert {
        font-size: 16px;
        padding: 15px 20px;
        color: white;
        margin: 5px 20px;
        border-radius: 7px;
        transition: opacity 0.5s ease-in-out; /* Add fade-out transition */
      }
      .info {
        background-color: #6ba2fa;
      }
      .error {
        background-color: #e65353;
      }

      .success {
        background-color: #78de7b;
      }

      .close {
        padding: 1px 4px;
        background: #7a7a7a;
        position: absolute;
        top: -13px;
        right: -11px;
        cursor: pointer;
      }
    `,
  ],
  template: `
    <ng-container *ngIf="notifications$ | async as notifications">
      <div
        style="position: relative;"
        *ngFor="let notification of notifications; trackBy: trackById"
        [style.opacity]="notification.fade ? 0 : 1"
        class="alert {{ notification.severity }}"
      >
        {{ notification.message }}

        <span
          class="close"
          (click)="notificationService.remove(notification.id!)"
          >X</span
        >
      </div>
    </ng-container>
  `,
})
export class NotificationComponent implements OnInit {
  notificationService = inject(NotificationService);
  notifications$ = this.notificationService.notifications$;

  trackById = (index: number, notification: Notification) => notification.id;
  ngOnInit(): void {}
}
