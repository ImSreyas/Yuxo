import { useRouter } from "next/navigation";
import { useState } from "react";
import supabase from "@/utils/supabase/client";
import { z } from "zod";
import { OperatorFormSchema } from "@/schema/form";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();

  const login = async (email: string, password: string, path: string = "/") => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    const user = data?.user;
    if (error) {
      setError(error.message);
    } else {
      router.push(path);
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
        const { error: userInsertError } = await supabase
          .from("tbl_users")
          .insert({
            user_id: user.id,
            email: user.email,
          });
        const { error: roleInsertError } = await supabase
          .from("tbl_user_roles")
          .insert({
            id: user.id,
            role: "user",
          });

        // login the user
        login(email, password);
        // router.push("/");
      }
    }
    setLoading(false);
    return user;
  };

  const operatorSignUp = async (
    formData: z.infer<typeof OperatorFormSchema>
  ) => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    const operator = data?.user;

    if (error) {
      setError(error.message);
    } else {
      if (operator) {
        const { error: operatorInsertError } = await supabase
          .from("tbl_operators")
          .insert({
            operator_id: operator.id,
            name: formData.name,
            phone: formData.phone,
            email: operator.email,
            place: formData.place,
            permit_no: formData.permit_no,
            is_ksrtc_operator: formData.is_ksrtc_operator
          });
        const { error: roleInsertError } = await supabase
          .from("tbl_user_roles")
          .insert({
            id: operator.id,
            role: "operator",
          });

        // Login the operator
        login(formData.email, formData.password, "/operator");
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
