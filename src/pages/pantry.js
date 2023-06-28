import Form from "@/components/Form";
import Router from "next/router";
import { useEffect, useState } from "react";

function Pantry() {
  const [items, setItems] = useState([]);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      Router.push("/login");
    }
    setToken(token);
    fetch("/api/pantry", {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setItems(data.data);
      });
  }, []);

  const postData = async (form) => {
    try {
      const res = await fetch("/api/pantry", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }
      const data = await res.json();

      setItems(items.concat(data.data));
    } catch (error) {
      console.log(error);
      setMessage(error);
    }
  };

  const putData = async (id, amount) => {
    try {
      const res = await fetch(`/api/pantry/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      const { data } = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
      setMessage(error);
    }
  };

  const handleAdd = (id) => {
    const item = items.find((i) => i._id === id);
    putData(item._id, item.amount + 1);
    const newItems = items.map((i) => {
      if (i._id === id) {
        return { ...i, amount: i.amount + 1 };
      } else {
        return i;
      }
    });
    setItems(newItems);
  };

  const handleSubtract = async (id) => {
    const item = items.find((i) => i._id === id);
    if (item.amount === 1) {
      try {
        const res = await fetch(`/api/sendgrid`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product: item.name }),
        });

        if (!res.ok) {
          throw new Error(res.status);
        }

        const { data } = await res.json();
        console.log(data);
      } catch (error) {
        console.error(error);
        setMessage(error);
      }
      setNotification(
        "You went short of a product. We've just mailed you about it."
      );
    }
    if (item.amount === 0) {
      return;
    }
    putData(item._id, item.amount - 1);
    const newItems = items.map((i) => {
      if (i._id === id) {
        return { ...i, amount: i.amount - 1 };
      } else {
        return i;
      }
    });
    setItems(newItems);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/pantry/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(res.status);
      }
      const newItems = items.filter((i) => i._id !== id);
      setItems(newItems);
    } catch (error) {
      console.error(error);
      setMessage(error);
    }
  };

  return (
    <main>
      {notification && <p>{notification}</p>}
      <h1>Pantry Organizer</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="table-auto border border-slate-700 p-2">
            <thead>
              <tr>
                <th className="border border-slate-700 p-2">Item</th>
                <th className="border border-slate-700 p-2">Quantity</th>
                <th className="border border-slate-700 p-2">Add One</th>
                <th className="border border-slate-700 p-2">Subtract One</th>
                <th className="border border-slate-700 p-2">Delete Item</th>
              </tr>
            </thead>
            {items && items.length ? (
              <tbody>
                {items.map((i) => (
                  <tr key={i._id}>
                    <td className="border border-slate-700 p-2">{i.name}</td>
                    <td className="border border-slate-700 p-2">{i.amount}</td>
                    <td className="border border-slate-700 p-2 text-center">
                      <button
                        className="rounded-full bg-blue-400 px-4 text-lg hover:bg-blue-600"
                        onClick={() => handleAdd(i._id)}
                      >
                        +
                      </button>
                    </td>
                    <td className="border border-slate-700 p-2 text-center">
                      <button
                        className="rounded-full bg-blue-400 px-4 text-lg hover:bg-blue-600"
                        onClick={() => handleSubtract(i._id)}
                      >
                        -
                      </button>
                    </td>
                    <td className="border border-slate-700 p-2 text-center">
                      <button
                        className="rounded-full bg-red-400 px-4 text-lg hover:bg-red-600"
                        onClick={() => handleDelete(i._id)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>
          <div className="container mx-auto mt-4 bg-white shadow-md rounded p-6">
            <h3>New Product</h3>
            <Form postData={postData} message={message} />
          </div>
        </>
      )}
    </main>
  );
}

export default Pantry;
