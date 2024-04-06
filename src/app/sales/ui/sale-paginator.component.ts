import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sale-paginator',
  standalone: true,
  imports: [],
  template: `
    <p>
      sale-paginator works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalePaginatorComponent {

}
