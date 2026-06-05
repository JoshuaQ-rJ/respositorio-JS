


/**
 * @file auth.service.js
 * @description Consumo aislado de la API de usuarios para validación de credenciales.
 */

const API_URL = "http://localhost:3000/users"; // URL base del json-server para usuarios

/**
 * Valida las credenciales ingresadas comparándolas con la base de datos simulada.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Retorna el objeto del usuario verificado.
 */
export async function authenticate(email, password) {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al conectar con el servidor de autenticación.");
        console.log("Respuesta del servidor de autenticación:", response);
        
        const users = await response.json();        
        console.log("Usuarios obtenidos del servidor:", users);
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        // Validación simple de contraseña en texto plano para entornos json-server
        if (!user) {
            throw new Error("Las credenciales ingresadas son incorrectas.");
        }

        // Retornamos el usuario quitando el campo password por seguridad arquitectónica
        const { password: _, ...secureUserSession } = user;
        return secureUserSession;

    } catch (error) {
        throw error;
    }
}