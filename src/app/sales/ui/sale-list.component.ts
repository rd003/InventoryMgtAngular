import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [],
  template: `
    <p>
      sale-list works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleListComponent {

}
