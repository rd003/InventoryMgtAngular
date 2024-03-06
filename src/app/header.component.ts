import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [],
  template: ` <p>header</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
