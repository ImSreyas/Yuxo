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
    console.log(data);
    const user = data?.user;
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }

    return user;
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
          name: "",
        });
        console.log(insertError);
        login(email, password);
        // router.push("/");
      }
    }
    setLoading(false);
    return user;
  };

  const operatorSignUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log(data);

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
    return await supabase.auth.getUser();
  };

  return {
    userSignUp,
    operatorSignUp,
    loading,
    error,
  };
};

export default useAuth;
