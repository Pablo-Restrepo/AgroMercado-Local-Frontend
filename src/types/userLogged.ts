export interface LoggedUser {
  u_id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: string;
}

export interface MeResponse {
  status: string;
  message: string;
  data: LoggedUser;
}