import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portal-tickets',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Tus citas
        </h1>
        <div
          class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center"
        >
          <p class="text-gray-500 dark:text-gray-400">
            Próximamente podrás gestionar tus citas desde aquí.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class PortalTicketsComponent {}
