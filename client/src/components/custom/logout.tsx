import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    secureLocalStorage.clear();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white p-2 rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
