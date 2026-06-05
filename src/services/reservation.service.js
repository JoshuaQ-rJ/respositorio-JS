import { http } from "@/api/http";

export const getReservations = async () => {
  try {
    return await http.get("/reservas");
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

export const createReservation = async (data) => {
  try {
    return await http.post("/reservas", data);
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};