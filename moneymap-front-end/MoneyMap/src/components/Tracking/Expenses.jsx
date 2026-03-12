import React,{useState,useEffect} from "react"
import {getCurrentUser} from "../../services/authService"


export default function Expenses({expenseList,setExpenseList}){

const [date,setDate] = useState("")           // Input: date
const [amount,setAmount] = useState("")       // Input: amount
const [description,setDescription] = useState("") // Input: description

const user = getCurrentUser()                 // Get logged-in user

// Load expenses for logged-in user
useEffect(()=>{
  fetch(`http://localhost:8080/api/expenses/${user.id}`)
    .then(res=>res.json())
    .then(data=>setExpenseList(data))
},[])

// Add a new expense
const handleAddExpense = async(e)=>{
  e.preventDefault()

  const newExpense = {date, amount:Number(amount), description}

  // Send to backend
  const response = await fetch(`http://localhost:8080/api/expenses/${user.id}`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(newExpense)
  })
  const savedExpense = await response.json()

  setExpenseList([...expenseList,savedExpense]) // Update frontend list
}

return(
<div>
  <h1>Expense Tracker</h1>

  {/* Form */}
  <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}/>
  <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)}/>
  <input type="text" value={description} onChange={(e)=>setDescription(e.target.value)}/>

  <button onClick={handleAddExpense}>Add Expense</button>
</div>
)
}