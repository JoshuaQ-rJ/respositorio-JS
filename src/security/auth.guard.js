import { getSession } from "@/utils";

export function loginUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

export function logoutUser() {
    localStorage.removeItem("user");
}