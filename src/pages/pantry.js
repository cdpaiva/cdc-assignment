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
import Nav from "@/components/Nav";
import TrashCan from "@/svg/TrashCan";
import MinusSign from "@/svg/MinusSign";
import PlusSign from "@/svg/PlusSign";

function Pantry() {
  const [items, setItems] = useState([]);
  const [token, setToken] = useState("");
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
      await deleteItem(token, id);
      const newItems = items.filter((i) => i._id !== id);
      setItems(newItems);
    } catch (error) {
      setError("Failed to delete the item. Try again later.");
    }
  };

  return (
    <>
      <Nav />
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
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <table className="table-auto p-2 border border-slate-700 mt-4 mx-auto text-sm shadow-md">
              <thead className="bg-slate-700 text-slate-100">
                <tr className="border border-slate-700 text-left">
                  <th className="p-2">Item</th>
                  <th className="p-2">Amount</th>
                  <th className="border border-slate-700 p-2"></th>
                  <th className="border border-slate-700 p-2"></th>
                  <th className="border border-slate-700 p-2"></th>
                </tr>
              </thead>
              {items && items.length ? (
                <tbody>
                  {items.map((i) => (
                    <tr
                      key={i._id}
                      className="border-b border-slate-700 transition duration-200 ease-in-out hover:bg-slate-300"
                    >
                      <td className="p-2">{i.name}</td>
                      <td className="p-2">{i.amount}</td>
                      <td className="p-2 text-center">
                        <button onClick={() => handleAdd(i._id)}>
                          <PlusSign />
                        </button>
                      </td>
                      <td className="p-2 text-center">
                        <button onClick={() => handleSubtract(i._id)}>
                          <MinusSign />
                        </button>
                      </td>
                      <td className="p-2 text-center">
                        <button onClick={() => handleDelete(i._id)}>
                          <TrashCan />
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
    </>
  );
}

export default Pantry;
