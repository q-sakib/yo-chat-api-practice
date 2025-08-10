import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: "page-not-found",
  template: `<div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4"
  >
    <h1 class="text-6xl font-bold text-red-600 mb-4">404</h1>
    <h2 class="text-2xl font-semibold mb-2">Page Not Found</h2>
    <p class="text-gray-600 mb-6">
      Sorry, the page you're looking for doesn't exist.
    </p>
    <!-- <a
      routerLink="/app"
      class="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
    >
      Go to Homepage
    </a> -->

    <button
      (click)="goHome()"
      class="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
    >
      Go to Homepage
    </button>
  </div> `,
})
export class PageNotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(["/messages"]);
  }
}
