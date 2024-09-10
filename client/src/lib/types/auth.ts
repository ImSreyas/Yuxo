export type authCheckResponse = {
  success: boolean;
  userRole?: string | null;
  data?: any;
  error?: any;
};
