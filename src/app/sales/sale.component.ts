import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-sale",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, JsonPipe, MatButtonModule],
  providers: [],
  styles: [``],
  template: `
    <div style="display: flex;align-items:center;gap:5px;margin-bottom:8px">
      <span style="font-size: 26px;font-weight:bold"> Sales </span>
      <button mat-raised-button color="primary" (click)="({})">Add More</button>
    </div>
  `,
})
export class SaleComponent {}
