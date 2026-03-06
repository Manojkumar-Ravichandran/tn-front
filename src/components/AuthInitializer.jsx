import { useEffect, useRef } from "react";
import useAuthStore from "../features/auth/authStore";
import { getProfile } from "../features/auth/authApi";

const AuthInitializer = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initAuth = async () => {
      if (!token) return;

      try {
        const user = await getProfile();
        setUser(user);
      } catch (err) {
        console.error(err);
        logout(); // remove invalid token
      }
    };

    initAuth();
  }, [token]);

  return children;
};

export default AuthInitializer;