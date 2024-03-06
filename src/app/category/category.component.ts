import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [],
  template: `
    <p>
      category works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {

}
