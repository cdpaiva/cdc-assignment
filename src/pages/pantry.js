import Form from "@/components/Form";
import Router from "next/router";
import { useEffect, useState } from "react";
import Notification from "@/components/Notification";
import {
  getAllItems,
  createNewItem,
  updateItem,
  sendMail,
  deleteItem,
} from "@/lib/pantryService";

function Pantry() {
  const [items, setItems] = useState([]);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      Router.push("/login");
    }
    setToken(token);

    getAllItems(token)
      .then((data) => {
        setLoading(false);
        setItems(data.data);
      })
      .catch((err) =>
        setNotification("Could not get your data, please try again")
      );
  }, []);

  const postData = async (newItem) => {
    try {
      await createNewItem(token, newItem);

      setItems(items.concat(data.data));
    } catch (error) {
      setError("Failed to create a new item. Try again later.");
    }
  };

  const putData = async (id, amount) => {
    try {
      await updateItem(id, token, amount);
    } catch (error) {
      setError("Failed to update the item. Try again later.");
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
    if (item.amount === 0) {
      return;
    }

    if (item.amount === 1) {
      try {
        await sendMail(token, item.name);
      } catch (error) {
        setError("Failed to send an e-mail notification. Try again later.");
      }
      setNotification(
        "You went short of a product. We've just mailed you about it."
      );
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
      await deleteItem("token", id);
      const newItems = items.filter((i) => i._id !== id);
      setItems(newItems);
    } catch (error) {
      setError("Failed to delete the item. Try again later.");
    }
  };

  return (
    <main>
      {notification && (
        <Notification
          text={notification}
          setter={setNotification}
          variant="info"
        />
      )}
      {error && (
        <Notification text={error} setter={setError} variant="danger" />
      )}
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
            <Form postData={postData} />
          </div>
        </>
      )}
    </main>
  );
}

export default Pantry;
