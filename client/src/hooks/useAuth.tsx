import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = secureLocalStorage.getItem("TOKEN");
      if (!token) return;

      try {
        const { data } = await axios.get(
          "http://localhost:5001/api/users/login/decode-login-token",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        secureLocalStorage.removeItem("TOKEN");
      }
    };

    verifyToken();
  }, []);

  return user;
}
