import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../serve/auth.service";
@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: "page-unauthorized",
  template: `<div
    class="flex items-center justify-center min-h-screen bg-gray-100 px-4"
  >
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
      <h2 class="text-6xl font-bold text-red-600 mb-4">Access Denied</h2>
      <p class="text-gray-700 mb-6">
        You are not authorized to view this page.
      </p>
      <button
        (click)="goHome()"
        class="bg-red-600 text-white px-5 py-2 rounded hover:bg-purple-700 transition"
      >
        ...back to Homepage
      </button>
    </div>
  </div> `,
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(["/auth/login"]);
  }
}
