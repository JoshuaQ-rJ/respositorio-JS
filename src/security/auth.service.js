const API_URL = "http://localhost:3000/users";

export async function authenticate(email, password) {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al conectar con el servidor de autenticación.");

        const users = await response.json();
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (!user) {
            throw new Error("Las credenciales ingresadas son incorrectas.");
        }

        const { password: _, ...secureUserSession } = user;
        return secureUserSession;

    } catch (error) {
        throw error;
    }
}
