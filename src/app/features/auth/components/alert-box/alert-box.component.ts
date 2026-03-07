import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertBoxComponent {
  readonly message = input.required<string>();
  readonly isVisible = input(true);
}
