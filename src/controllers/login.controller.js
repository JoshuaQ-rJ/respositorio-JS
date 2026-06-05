import { saveSession } from "@/utils";
import { navigateTo } from "@/router/router";
import { qs } from "@/utils/dom";
import { authenticate } from "@/security/auth.service";
import { loginUser } from "@/security/auth.guard";

export const loginController = () => {
  const form = qs("#loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    try {
      const user = await authenticate(email, password);
      saveSession(user);
      loginUser(user);
      navigateTo("/home");
    } catch (error) {
      alert("❌ " + error.message);
    }
  });
}
