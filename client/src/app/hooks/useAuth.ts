import { useRouter } from "next/navigation";
import { useState } from "react";
import supabase from "@/utils/supabase/client";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    const user = data?.user;
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }

    return { user, error };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
    }
    return { error };
  };

  const userSignUp = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({ email, password });
    const user = data?.user;

    if (error) {
      setError(error.message);
    } else {
      if (user) {
        const { error: insertError } = await supabase.from("tbl_users").insert({
          user_id: user.id,
          email: user.email,
        });
        login(email, password);
        // router.push("/");
      }
    }
    setLoading(false);
    return user;
  };

  const operatorSignUp = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({ email, password });
    const operator = data?.user;

    if (error) {
      setError(error.message);
    } else {
      if (operator) {
        const { error: insertError } = await supabase.from("tbl_operators").insert({
          operator_id: operator.id,
          email: operator.email,
        });
        login(email, password);
        // router.push("/");
      }
    }
    setLoading(false);
    return operator;
  };

  return {
    login,
    logout,
    userSignUp,
    operatorSignUp,
    loading,
    error,
  };
};

export default useAuth;
