import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [],
  template: ` <h2>Page not found</h2> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
