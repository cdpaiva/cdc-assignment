import Form from "@/components/Form";
import Router from "next/router";
import { useEffect, useReducer, useState } from "react";
import Notification from "@/components/Notification";
import {
  getAllItems,
  createNewItem,
  updateItem,
  sendMail,
  deleteItem,
} from "@/lib/pantryService";
import Nav from "@/components/Nav";
import PantryItem from "@/components/PantryItem";

function reducer(state, action) {
  switch (action.type) {
    case "request_started":
      return { loading: true, items: [], error: "" };
    case "request_succeeded":
      return {
        items: action.payload,
        loading: false,
        error: "",
      };
    case "request_failed":
      return {
        items: [],
        loading: false,
        error: action.error,
      };
    case "show_notification":
      return {
        items: state.items,
        notification: action.payload,
      };
    case "item_created":
      return {
        items: state.items.concat(action.payload),
        loading: false,
        error: "",
      };
    case "item_deleted":
      return {
        items: state.items.filter((i) => i._id !== action.id),
        loading: false,
        error: "",
      };
    case "update_amount":
      return {
        ...state,
        items: state.items.map((i) => {
          if (i._id === action.itemId) {
            return { ...i, amount: action.amount };
          } else {
            return i;
          }
        }),
      };
    case "close_notification":
      return {
        ...state,
        notification: "",
      };
    case "close_notification":
      return {
        ...state,
        error: "",
      };
    default:
      return state;
  }
}

function Pantry() {
  const [token, setToken] = useState("");
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Router.push("/login");
    }
    setToken(token);

    dispatch({ type: "request_started" });
    getAllItems(token)
      .then((data) => {
        dispatch({ type: "request_succeeded", payload: data.data });
      })
      .catch(() => {
        dispatch({
          type: "request_failed",
          error: "Could not get your data, please try again",
        });
      });
  }, []);

  const postData = async (newItem) => {
    try {
      const data = await createNewItem(token, newItem);
      dispatch({ type: "item_created", payload: data.data });
    } catch (error) {
      dispatch({
        type: "request_failed",
        error: "Failed to create a new item. Try again later.",
      });
    }
  };

  const putData = async (id, amount) => {
    try {
      await updateItem(id, token, amount);
    } catch (error) {
      dispatch({
        type: "request_failed",
        error: "Failed to update the item. Try again later.",
      });
    }
  };

  const handleAdd = (id) => {
    const item = state.items.find((i) => i._id === id);
    putData(item._id, item.amount + 1);
    dispatch({
      type: "update_amount",
      itemId: id,
      amount: item.amount + 1,
    });
  };

  const handleSubtract = async (id) => {
    const item = state.items.find((i) => i._id === id);
    if (item.amount === 0) {
      return;
    }

    if (item.amount === 1) {
      try {
        await sendMail(token, item.name);
        console.log("about to dispatyc");
        dispatch({
          type: "show_notification",
          payload:
            "You went short of a product. We've just mailed you about it.",
        });
      } catch (err) {
        console.log(err);
        dispatch({
          type: "request_failed",
          error: "Failed to send an e-mail notification. Try again later.",
        });
      }
    }

    putData(item._id, item.amount - 1);
    dispatch({
      type: "update_amount",
      itemId: id,
      amount: item.amount - 1,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(token, id);
      dispatch({ type: "item_deleted", id });
    } catch (error) {
      dispatch({
        type: "request_failed",
        error: "Failed to delete the item. Try again later.",
      });
    }
  };

  return (
    <>
      <Nav />
      <main>
        {state.notification && (
          <Notification
            text={state.notification}
            close={() => dispatch({ type: "close_notification" })}
            variant="info"
          />
        )}
        {state.error && (
          <Notification
            text={state.error}
            close={() => dispatch({ type: "close_error" })}
            variant="danger"
          />
        )}
        {state.loading ? (
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
              {state.items.length ? (
                <tbody>
                  {state.items.map((i) => (
                    <PantryItem
                      key={i._id}
                      item={i}
                      handleAdd={handleAdd}
                      handleSubtract={handleSubtract}
                      handleDelete={handleDelete}
                    />
                  ))}
                </tbody>
              ) : null}
            </table>
            <div className="container mx-auto mt-4 p-4 text-center">
              <h3 className="my-4 text-xl">Add New Product</h3>
              <Form postData={postData} />
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default Pantry;
