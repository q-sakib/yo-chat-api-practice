export interface User {
  id: number;
  name: string;
  username: string | null;
  email: string;
  created_at: string;
  updated_at: string;
  refresh_token?: string | null;
  refresh_token_expires_at?: string | null;

  // These properties were in your original interface but are NOT in the response:
  custom_id?: string | number;
  permissions?: string[];
  machine_id?: string | null;
}

export type USER_PERMISSIONS = User['permissions'];

export interface LoginResponse {
  user: User;
  token_type: string;
  expires_in: number | null;
  // Optional: Add `access_token` or `refresh_token` here if your API includes them
  access_token?: string;
  refresh_token?: string;
}
