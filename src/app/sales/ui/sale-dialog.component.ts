import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sale-dialog',
  standalone: true,
  imports: [],
  template: `
    <p>
      sale-dialog works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleDialogComponent {

}
