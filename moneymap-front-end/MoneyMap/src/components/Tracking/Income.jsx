import React,{useState,useEffect} from "react"
import {BsFillTrashFill,BsFillPencilFill} from "react-icons/bs"
import {useNavigate} from "react-router-dom"

// Income tracker component
export default function Income({incomeList,setIncomeList}){

const [date,setDate] = useState("")
const [amount,setAmount] = useState("")
const [description,setDescription] = useState("")
const [editingIndex,setEditingIndex] = useState(null)
const [error,setError] = useState("")
const [selectedMonth,setSelectedMonth] = useState("")

const navigate = useNavigate()

// Load incomes from backend when component mounts
useEffect(()=>{
  fetch("http://localhost:8080/api/incomes")
    .then(res=>res.json())
    .then(data=>setIncomeList(data))
    .catch(err=>console.error(err))
},[])

// Filter incomes by selected month
const filteredIncome = selectedMonth
? incomeList.filter(item => item.date.slice(0,7) === selectedMonth)
: incomeList

// Add or update income
const handleAddIncome = async(e)=>{
  e.preventDefault()
  if(!date){setError("Enter date");return}         // Validate date
  if(!amount){setError("Enter amount");return}     // Validate amount

  const newIncome = {date, amount:Number(amount), description} // Create object

  // Send to backend
  const response = await fetch("http://localhost:8080/api/incomes",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(newIncome)
  })
  const savedIncome = await response.json()        // Get saved income

  if(editingIndex===null){
    setIncomeList([...incomeList,savedIncome])     // Add new income
  } else {
    const updated = incomeList.map((item,idx)=>
      idx===editingIndex ? savedIncome : item
    )
    setIncomeList(updated)                          // Update income
    setEditingIndex(null)
  }

  setDate(""); setAmount(""); setDescription("")   // Reset form
}

// Delete income locally
const handleRemoveIncome = (i)=>{
  setIncomeList(incomeList.filter((_,idx)=>idx!==i))
}

// Load income into form for editing
const handleEditIncome = (i)=>{
  const item = incomeList[i]
  setDate(item.date); setAmount(item.amount); setDescription(item.description)
  setEditingIndex(i)
}

// Calculate total for filtered incomes
const totalAmount = filteredIncome.reduce((sum,item)=>sum+item.amount,0)

// Extract unique months for filter dropdown
const monthOptions = Array.from(new Set(incomeList.map(item=>item.date.slice(0,7)))).sort()

return(
<div>
  <h1>Income Tracker</h1>

  {/* Month filter */}
  <select value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)}>
    <option value="">All Months</option>
    {monthOptions.map(month=>(
      <option key={month} value={month}>{month}</option>
    ))}
  </select>

  {/* Error message */}
  {error && <p>{error}</p>}

  {/* Form */}
  <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}/>
  <input type="number" placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)}/>
  <input type="text" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)}/>

  {/* Buttons */}
  <button onClick={handleAddIncome}>{editingIndex!==null ? "Update Income":"Add Income"}</button>
  <button onClick={()=>navigate("/expenses")}>Go to Expenses</button>

  {/* Table */}
  <table>
    <thead>
      <tr><th>Date</th><th>Amount</th><th>Description</th><th>Action</th></tr>
    </thead>
    <tbody>
      {filteredIncome.map((item,index)=>(
        <tr key={index}>
          <td>{item.date}</td>
          <td>{item.amount}</td>
          <td>{item.description}</td>
          <td>
            <BsFillTrashFill onClick={()=>handleRemoveIncome(index)}/> {/* Delete */}
            <BsFillPencilFill onClick={()=>handleEditIncome(index)}/>  {/* Edit */}
          </td>
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr>
        <th>Total</th>
        <th colSpan="3">{totalAmount}</th>
      </tr>
    </tfoot>
  </table>
</div>
)
}