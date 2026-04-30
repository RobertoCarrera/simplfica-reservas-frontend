import { Component, OnInit, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastComponent } from "./shared/ui/toast/toast.component";
import { BrandingService } from "./core/services/branding.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `<router-outlet></router-outlet><app-toast />`,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  private brandingService = inject(BrandingService);

  async ngOnInit(): Promise<void> {
    // Load company branding for dynamic theming
    await this.brandingService.loadBranding();
  }
}