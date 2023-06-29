import { useState } from "react";

const Form = ({ postData }) => {
  // empty object in state feels a bit susicious
  //
  // You own the complexity of categorizing erorrs, but do not display
  // errors adjacent to the fields, you just display the list of errors
  //
  // We could display the key, so the user knows the field, but that still
  // does not justify the complexity... let's refactor to reduce the internal
  // complexity while improving the UX (showing field details)
  const [errors, setErrors] = useState([]);

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
      // good & smart, nice job
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = [];
    if (!form.name) newErrors.push("Name is required");
    if (!form.amount) newErrors.push("Amount is required");
    if (!form.category) newErrors.push("Category is required");
    setErrors(newErrors);
    if (!newErrors.length) {
      postData(form);
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
              /* if you want you code to do anything if the field is blank,
              you can't set this DOM property, because the browser will block
              submission, and you code never gets a chance

              There are accessibility downsides to ejecting from HTML / DOM

              required

              */
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
        {errors.map((err, index) => (
          <li
            /* do not use index as key!!! React hits the render cache based on the key you provide,
          so if the key is a array index, you can get cache hits that are unintentional, and
          causes the wrong thing to render.

          */ key={err}
          >
            {err}
          </li>
        ))}
      </div>
    </>
  );
};

export default Form;
