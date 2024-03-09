import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { generateGuid } from "../utils/guid.util";

export type Notification = {
  id?: string | null;
  message: string;
  severity: "info" | "error" | "success";
  fade?: boolean;
};

@Injectable({ providedIn: "root" })
export class NotificationService {
  private messageSubject = new BehaviorSubject<Notification[]>([]);
  notifications$: Observable<Notification[]> =
    this.messageSubject.asObservable();

  send(notification: Notification) {
    notification.id = generateGuid();
    const notifications = this.messageSubject.value;
    this.messageSubject.next([...notifications, notification]);
    setTimeout(() => {
      const fadedNotification = { ...notification, fade: true };
      const updatedNotifications = this.messageSubject.value.map((a) =>
        a.id === notification.id ? fadedNotification : a
      );
      this.messageSubject.next(updatedNotifications);
      setTimeout(() => {
        this.remove(notification.id!);
      }, 800);
    }, 1500);
  }

  remove(id: string) {
    const notifications = this.messageSubject.value.filter((a) => a.id !== id);
    this.messageSubject.next(notifications);
  }

  clearAll() {
    this.messageSubject.next([]);
  }
}
