import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./header.component";
import { FooterComponent } from "./footer.component";
import { NotificationComponent } from "./shared/notification.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
  ],
  template: `
    <app-header />
    <app-notification />
    <div class="content-page">
      <router-outlet />
    </div>
    <app-footer />
  `,
  styles: [
    `
      :host {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      .content-page {
        padding: 20px;
        flex-grow: 1;
      }
    `,
  ],
})
export class AppComponent {
  constructor() {}
}
