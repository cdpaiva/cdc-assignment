import MinusSign from "@/svg/MinusSign";
import PlusSign from "@/svg/PlusSign";
import RemoveSign from "@/svg/RemoveSign";

const PantryItem = ({ item, handleAdd, handleSubtract, handleDelete }) => {
  return (
    <tr className="border-b border-slate-700 transition duration-200 ease-in-out hover:bg-slate-200">
      <td className="p-2">{item.name}</td>
      <td className="p-2">{item.amount}</td>
      <td className="p-2 text-center">
        <button
          onClick={() => handleAdd(item._id)}
          className="hover:fill-green-500"
        >
          <PlusSign />
        </button>
      </td>
      <td className="p-2 text-center">
        <button
          onClick={() => handleSubtract(item._id)}
          className="hover:fill-green-500"
        >
          <MinusSign />
        </button>
      </td>
      <td className="p-2 text-center">
        <button
          onClick={() => handleDelete(item._id)}
          className="hover:fill-green-500"
        >
          <RemoveSign />
        </button>
      </td>
    </tr>
  );
};

export default PantryItem;
