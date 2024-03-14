import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";

@Component({
  selector: "app-product-paginator",
  standalone: true,
  imports: [MatPaginatorModule],
  template: ``,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPaginatorComponent {}
