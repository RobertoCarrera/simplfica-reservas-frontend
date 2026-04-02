import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { Toast } from '../../models/toast.interface';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed top-4 right-4 z-[200001] space-y-3 max-w-sm">
      @for (toast of toastService.toasts$(); track toast.id) {
        <div
          class="flex items-start p-4 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 animate-slide-in"
          [class]="getToastClasses(toast.type)"
        >
          <div class="flex-shrink-0 mr-3">
            <div class="w-6 h-6 rounded-full flex items-center justify-center"
                 [class]="getIconClasses(toast.type)">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                @switch (toast.type) {
                  @case ('success') {
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  }
                  @case ('error') {
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  }
                  @case ('warning') {
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  }
                  @case ('info') {
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                  }
                }
              </svg>
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ toast.title }}</div>
            <div class="mt-1 text-sm text-gray-500 dark:text-gray-300">{{ toast.message }}</div>
          </div>

          <button
            (click)="toastService.removeToast(toast.id)"
            class="flex-shrink-0 ml-4 inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(1rem); }
      to { opacity: 1; transform: translateX(0); }
    }
  `],
})
export class ToastComponent {
  toastService = inject(ToastService);

  getToastClasses(type: Toast['type']): string {
    const map: Record<string, string> = {
      success: 'bg-green-50 border-green-200 dark:bg-green-900/80 dark:border-green-700',
      error: 'bg-red-50 border-red-200 dark:bg-red-900/80 dark:border-red-700',
      warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/80 dark:border-yellow-700',
      info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/80 dark:border-blue-700',
    };
    return map[type];
  }

  getIconClasses(type: Toast['type']): string {
    const map: Record<string, string> = {
      success: 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200',
      error: 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200',
      warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-200',
      info: 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200',
    };
    return map[type];
  }
}
