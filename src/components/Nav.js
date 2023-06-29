import { useRouter } from "next/router";

const Nav = () => {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const inDataFetchingExamplePage = router.asPath === "/countries";

  return (
    <nav className="flex w-full items-center justify-between p-3 bg-slate-700">
      <a href="/" className="text-green-500 font-extrabold">
        Pantry Organizer
      </a>
      <div className="flex gap-4">
        {!inDataFetchingExamplePage && (
          <a href="/countries" className="text-white hover:text-green-500">
            Data Fetching Example
          </a>
        )}
        <button
          className="text-white hover:text-green-500"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Nav;
