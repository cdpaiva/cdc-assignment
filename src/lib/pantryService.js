export const getAllItems = (token) => {
  return fetch("/api/pantry", {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
  }).then((res) => res.json());
};

export const createNewItem = async (token, item) => {
  const res = await fetch("/api/pantry", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });

  if (!res.ok) {
    throw new Error(res.status);
  }
  const data = await res.json();

  return data;
};

export const updateItem = async (id, token, amount) => {
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
};

export const deleteItem = async (token, id) => {
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
};

export const sendMail = async (token, product) => {
  const res = await fetch(`/api/sendgrid`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product }),
  });

  if (!res.ok) {
    throw new Error(res.status);
  }
};
