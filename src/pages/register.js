import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.status !== 201) {
        console.log(res.error);
        setError("Could not save the user");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("Sorry, something went wrong");
    }
  };

  return (
    <div className="container mx-auto mt-4 bg-white shadow-md rounded p-6 text-center">
      {error && (
        <Notification
          variant="danger"
          text={error}
          close={() => setError("")}
        />
      )}
      <h1 className="text-2xl font-black text-green-500 my-4">
        Pantry Manager
      </h1>
      <form onSubmit={handleSubmit}>
        <label
          className="block text-left text-gray-700 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 "
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label
          className="block text-left text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 "
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label
          className="block text-left text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 "
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Register
        </button>
      </form>
      <Link href="/login" className="block mt-6 text-sm hover:text-green-500">
        Already registered? Click here to login
      </Link>
    </div>
  );
}
