import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastComponent } from "./shared/ui/toast/toast.component";
import { CookieConsentComponent } from "./shared/components/cookie-consent/cookie-consent.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ToastComponent, CookieConsentComponent],
  template: `
    <router-outlet></router-outlet>
    <app-toast />
    <app-cookie-consent />
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class AppComponent {
  title = "Simplify Portal";
}
