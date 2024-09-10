CREATE TABLE IF NOT EXISTS public.tbl_user_roles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR CHECK(role IN ('user', 'operator', 'admin')) DEFAULT 'user'
)