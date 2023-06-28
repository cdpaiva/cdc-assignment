import { useState } from "react";

const Form = ({ postData }) => {
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
  });

  const handleChange = (e) => {
    const target = e.target;
    const { value, name } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const formValidate = () => {
    let err = {};
    if (!form.name) err.name = "Name is required";
    if (!form.amount) err.owner_name = "Amount is required";
    if (!form.category) err.category = "Category is required";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = formValidate();
    if (Object.keys(errs).length === 0) {
      postData(form);
    } else {
      setErrors({ errs });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="text-black w-full mx-auto max-w-md"
      >
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/4">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="name"
            >
              Name
            </label>
          </div>
          <div className="md:w-3/4">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/4">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="amount"
            >
              Amount
            </label>
          </div>
          <div className="md:w-3/4">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              type="text"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/4">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="category"
            >
              Category
            </label>
          </div>
          <div className="md:w-3/4">
            <select
              className="bg-gray-200 border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              name="category"
              id="category"
              onChange={handleChange}
            >
              <option value="">--Please choose an option--</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="meat">Meat</option>
              <option value="snacks and candy">Snacks and Candy</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        >
          Add new item
        </button>
      </form>
      <div>
        {Object.keys(errors).map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </div>
    </>
  );
};

export default Form;
