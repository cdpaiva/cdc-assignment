import { useState, useEffect } from "react";

function useFetch(cb, config) {
  const [data, setData] = useState(null);

  // If we want to use this for POST requests, we probably don't want to
  // immediately start loading!
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);
  const triggerRequest = async (...stuff) => {
    setLoading(true);
    const response = await cb(...stuff);
    if (
      response.ok &&
      response.headers.get("content-type") === "application/json"
    ) {
      const data = await response.json();
      setData(data);
      setError(false);
    } else if (response.ok) {
      setError("Unexpected content-type");
      setData(null);
    } else if (response.headers.get("content-type") === "application/json") {
      const errData = await response.json();
      setData(null);
      setError(errData);
    } else {
      setData(null);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (config.triggerOnMount) {
      triggerRequest();
    }
  }, []);

  return { data, loading, error };
}

function getToken() {
  return "1";
}

function useGetAllItems() {
  return useFetch(() =>
    fetch("/api/pantry", {
      method: "GET",
      headers: { authorization: `Bearer ${getToken()}` },
    })
  );
}

export const useCreateNewItem = (item) =>
  fetch("/api/pantry", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(item),
  });

export const useUpdateItem = (id, amount) =>
  fetch(`/api/pantry/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ amount }),
  });

function Item(props) {
  const { data, triggerRequest } = useUpdateItem();
  return (
    <>
      <p>Count {data?.amount || props.item.amount}</p>
      <button
        onClick={() => {
          const id = data?.id || props.item.id;
          const currentCount = data?.amount || props.item.amount;
          triggerRequest(id, currentCount + 1);
        }}
      >
        Increment Count
      </button>
    </>
  );
}

export const useDeleteItem = (id) =>
  fetch(`/api/pantry/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`,
    },
  });

export const useSendMail = (product) =>
  fetch(`/api/sendgrid`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product }),
  });
