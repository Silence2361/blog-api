export interface IRegistration {
  email: string;
  password: string;
  name: string;
}

export interface IRegistrationResponse {
  id: number;
  email: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
}
