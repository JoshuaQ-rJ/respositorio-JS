import { saveSession } from "@/utils";
import { navigateTo } from "@/router/router";
import { http } from "@/api/http";
import { qs } from "@/utils/dom";
import { authenticate } from "@/security/auth.service";

export const loginController = () => {
  const form = qs("#loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    console.log("Email ingresado:", email);
    const password = form.password.value.trim();
    console.log("Password ingresado:", password);

    
      const user = await authenticate(email, password);
      console.log("Usuario autenticado:", user);
      saveSession(user);
          
      
      navigateTo("/home");
    
  });
}
