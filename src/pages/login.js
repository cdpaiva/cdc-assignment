import Notification from "@/components/Notification";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.status !== 200) {
        setError("Could not login");
      } else {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        router.push("/");
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
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 "
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label
          className="block text-left text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:border-green-500"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Login
        </button>
      </form>
      <Link
        href="/register"
        className="block mt-6 text-sm hover:text-green-500"
      >
        Do not have an account? Click here to register
      </Link>
    </div>
  );
}
