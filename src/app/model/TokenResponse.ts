import {User} from "@model/User";

export interface TokenResponse {
  status: boolean;
  access_token: string;
  token_type: string;
  expires_in: number;
  error: string
  user: User
}
