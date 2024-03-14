import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ProductService } from "./product.service";

@Component({
  selector: "app-product",
  standalone: true,
  imports: [],
  providers: [],
  template: ``,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
  ps = inject(ProductService);
  constructor() {
    this.ps.getProducts().subscribe({
      next: console.log,
      error: console.log,
    });
  }
}
