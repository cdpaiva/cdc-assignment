import { useRouter } from "next/router";

const Nav = () => {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <nav className="flex w-full items-center justify-between p-3 bg-slate-700">
      <p className="text-green-400 font-extrabold">Pantry Organizer</p>
      <button className="text-white" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Nav;
