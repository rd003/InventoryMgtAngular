import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [],
  template: `
    Built with Angular by
    <a
      style="color: black;"
      href="https://twitter.com/ravi_devrani"
      target="_blank"
    >
      Ravindra Devrani
    </a>
  `,
  styles: [
    `
      :host {
        padding: 10px 0px;
        text-align: center;
        font-size: 16px;
        border: 1px solid;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
