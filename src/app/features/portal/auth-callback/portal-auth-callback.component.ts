import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PortalAuthService } from '../../../core/services/portal-auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-portal-auth-callback',
  standalone: true,
  template: `
    <div class="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div class="text-center">
        @if (error()) {
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <i class="bi bi-x-circle text-2xl text-red-600 dark:text-red-400"></i>
          </div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error de autenticación</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ error() }}</p>
          <button
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            (click)="goToLogin()"
          >
            Volver al login
          </button>
        } @else {
          <div class="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Verificando acceso...</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Estamos validando tu enlace mágico</p>
        }
      </div>
    </div>
  `,
})
export class PortalAuthCallbackComponent implements OnInit {
  private auth = inject(PortalAuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  error = signal('');

  async ngOnInit() {
    try {
      // Supabase JS client auto-handles the token exchange from the URL hash/params
      // via onAuthStateChange listener in PortalAuthService.
      // We just wait for the session to be ready.

      // Give Supabase a moment to process the callback tokens
      await this.waitForSession(10_000);

      const session = await this.auth.getSession();
      if (session?.user) {
        this.toastService.success('Bienvenido', 'Sesión iniciada correctamente');
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      } else {
        this.error.set('No se pudo verificar el enlace. Puede haber expirado.');
      }
    } catch {
      this.error.set('Error al procesar el enlace de acceso.');
    }
  }

  goToLogin() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  private waitForSession(timeoutMs: number): Promise<void> {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = async () => {
        const session = await this.auth.getSession();
        if (session?.user || Date.now() - start > timeoutMs) {
          resolve();
          return;
        }
        setTimeout(check, 300);
      };
      check();
    });
  }
}
