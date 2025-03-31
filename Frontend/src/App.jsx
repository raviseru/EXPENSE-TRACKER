import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaWindowClose, FaSearch } from "react-icons/fa";
import { PieChart } from "@mui/x-charts/PieChart";
import { publicRequest } from "./requestMethods";

function App() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [updatedId, setUpdatedId] = useState("");
  const [updatedLabel, setUpdatedLabel] = useState("");
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.value),
    0
  );

  // Filter expenses based on search term
  useEffect(() => {
    const filtered = expenses.filter(
      (expense) =>
        expense.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.value.toString().includes(searchTerm)
    );
    setFilteredExpenses(filtered);
  }, [searchTerm, expenses]);

  const handleAddExpense = () => {
    setShowAddExpense(!showAddExpense);
  };

  const handleShowReport = () => {
    setShowReport(!showReport);
  };

  const handleUpdateExpense = async () => {
    if (updatedId) {
      try {
        await publicRequest.put(`/expenses/${updatedId}`, {
          value: updatedAmount,
          label: updatedLabel,
          date: updatedDate,
        });
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleShowEdit = (id) => {
    setShowEdit(!showEdit);
    setUpdatedId(id);
  };

  const handleExpense = async () => {
    try {
      await publicRequest.post("/expenses", {
        label,
        date,
        value: amount,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const res = await publicRequest.get("/expenses");
        setExpenses(res.data);
        setFilteredExpenses(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getExpenses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/expenses/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-[3%] w-[80%] mr-[5%] ml-[5%]">
        <h1 className="text-2xl font-medium text-[#555]">Expense Tracker</h1>

        <div className="relative flex items-center justify-between mt-5 w-[100%]">
          <div className="relative flex justify-between w-[300px]">
            <button
              className="bg-[#af8978] p-[10px] border-none outline-none cursor-pointer text-[#fff] text-medium"
              onClick={handleAddExpense}
            >
              Add Expense
            </button>
            <button
              className="bg-blue-300 p-[10px] border-none outline-none cursor-pointer text-[#fff] text-medium"
              onClick={handleShowReport}
            >
              Expense Report
            </button>
          </div>

          <div className="relative flex items-center">
            <FaSearch className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              className="p-[10px] pl-10 w-[250px] border-2 border-[#444] border-solid rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {showAddExpense && (
          <div className="absolute z-[999] flex flex-col p-[10px] top-[20px] left-0 h-[500px] w-[500px] bg-white shadow-xl">
            <FaWindowClose
              className="flex justify-end items-end text-2xl text-red-500 cursor-pointer"
              onClick={handleAddExpense}
            />
            <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
              Expense Name
            </label>
            <input
              type="text"
              placeholder="snacks"
              className="border-2 border-[#555] border-solid p-[10px] outline-none"
              onChange={(e) => setLabel(e.target.value)}
            />
            <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
              Expense Date
            </label>
            <input
              type="date"
              placeholder="22/05/2025"
              className="border-2 border-[#555] border-solid p-[10px] outline-none"
              onChange={(e) => setDate(e.target.value)}
            />
            <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
              Expense Amount
            </label>
            <input
              type="Number"
              placeholder="50"
              className="border-2 border-[#555] border-solid p-[10px] outline-none"
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              className="bg-[#af8978] text-white p-[10px] border-none cursor-pointer my-[10px]"
              onClick={handleExpense}
            >
              Add Expense
            </button>
          </div>
        )}

        {showReport && (
          <div className="absolute z-[999] flex flex-col p-[10px] top-[20px] left-[100px] h-[550px] w-[500px] bg-white shadow-xl">
            <FaWindowClose
              className="flex justify-end items-end text-2xl text-red-500 cursor-pointer"
              onClick={handleShowReport}
            />
            <PieChart
              series={[
                {
                  data: expenses,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  startAngle: -45,
                  endAngle: 225,
                  cx: 150,
                  cy: 150,
                },
              ]}
            />
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold text-center">
                Expense Summary
              </h3>
              <div className="flex justify-between mt-2">
                <span className="font-medium">Total Expenses:</span>
                <span className="font-bold">${totalExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-medium">Number of Expenses:</span>
                <span className="font-bold">{expenses.length}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-medium">Average Expense:</span>
                <span className="font-bold">
                  $
                  {expenses.length > 0
                    ? (totalExpenses / expenses.length).toFixed(2)
                    : "0.00"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col w-full">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((item, index) => (
              <div
                className="relative flex justify-between items-center w-full h-[100px] bg-[#f3edeb] my-[20px] py-[10px]"
                key={index}
              >
                <h2 className="m-[20px] text-[#555] text-[18px] font-medium">
                  {item.label}
                </h2>
                <span className="m-[20px] text-[18px]">{item.date}</span>
                <span className="m-[20px] text-[18px] font-medium">
                  $ {item.value}
                </span>
                <div className="m-[20px]">
                  <FaTrash
                    className="text-red-500 mb-[5px] cursor-pointer"
                    onClick={() => handleDelete(item._id)}
                  />
                  <FaEdit
                    className="text-[#555] mb-[5px] cursor-pointer"
                    onClick={() => handleShowEdit(item._id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              {searchTerm
                ? "No matching expenses found"
                : "No expenses added yet"}
            </div>
          )}
        </div>

        {showEdit && (
          <div className="absolute z-[999] flex flex-col p-[10px] top-[25%] right-0 h-[500px] w-[500px] bg-white shadow-xl">
            <FaWindowClose
              className="flex justify-end items-end text-2xl text-red-500 cursor-pointer"
              onClick={handleShowEdit}
            />
            <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
              Expense Name
            </label>
            <input
              type="text"
              placeholder="snacks"
              className="border-2 border-[#555] border-solid p-[10px] outline-none"
              onChange={(e) => setUpdatedLabel(e.target.value)}
            />
            <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
              Expense Date
            </label>
            <input
              type="date"
              placeholder="22/05/2025"
              className="border-2 border-[#555] border-solid p-[10px] outline-none"
              onChange={(e) => setUpdatedDate(e.target.value)}
            />
            <label htmlFor="" className="mt-[10px] font-semibold text-[18px]">
              Expense Amount
            </label>
            <input
              type="Number"
              placeholder="50"
              className="border-2 border-[#555] border-solid p-[10px] outline-none"
              onChange={(e) => setUpdatedAmount(e.target.value)}
            />
            <button
              className="bg-[#af8978] text-white p-[10px] border-none cursor-pointer my-[10px]"
              onClick={handleUpdateExpense}
            >
              Update Expense
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
