import "@/style.css";
import { router } from "@/router.js";

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", () => {
  if (!window.location.hash) {
    window.location.hash = "#/login";
    return;
  }

  router();
});
