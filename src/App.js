import { useReducer } from "react";
import DigitBtn from "./DigitBtn";
import OperationtBtn from "./OperationtBtn";
import "./index.css"

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){
  switch(type){

    case ACTIONS.ADD_DIGIT:
      if(state.overwrite)return{
        ...state,
        currentOperand : payload.digit,
        overwrite : false
      }
      if(payload.digit === "0" && state.currentOperand === "0") return state
      if( state.currentOperand === '.') if(payload.digit === "." && state.currentOperand.includes(".")) return state
      return{
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null ) return state

      if(state.currentOperand == null) return{
        ...state,
        operation: payload.operation
      }

      if(state.previousOperand== null) return{
        ...state,
        operation: payload.operation,
        previousOperand: state.currentOperand,
        currentOperand: null
      }
      return{
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.CLEAR: 
      return{
      }
    
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) return{
        ...state,
        overwrite: false,
        currentOperand:null
      }

      if(state.currentOperand == null) return state

      if(state.currentOperand.length === 1) return {
        ...state,
        currentOperand:null
      }
      
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }

    case ACTIONS.EVALUATE:
      if(state.operation == null || state.currentOperand == null || state.previousOperand == null) return state
      return{
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
      default : return
  }
}

function evaluate({currentOperand,previousOperand,operation}){
  const previous = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  let computation = ""

  if(isNaN(previous) || isNaN(current) )return computation
  switch(operation){
    case "+":
      computation = previous + current
      break

    case "-":
      computation = previous - current
      break

    case "*":
      computation = previous * current
      break

    case "÷":
      computation = previous / current
      break
    
    default: return
  }
  return computation.toString()
  
}

const formatter = new Intl.NumberFormat("en-us",{maximumFractionDigits:0})
function formatOperand(operand){
  if(operand == null) return
  const [integer,decimal] = operand.split('.')
  if(decimal == null) return formatter.format(integer)
  return `${formatter.format(integer)}.${decimal}`
}

export default function App() {

  const [{currentOperand,previousOperand,operation} , dispatch] = useReducer(reducer, {})
 
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={()=> dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=> dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationtBtn operation="÷" dispatch={dispatch}/>
      <DigitBtn digit="1" dispatch={dispatch}/>
      <DigitBtn digit="2" dispatch={dispatch}/>
      <DigitBtn digit="3" dispatch={dispatch}/>
      <OperationtBtn operation="*" dispatch={dispatch}/>
      <DigitBtn digit="4" dispatch={dispatch}/>
      <DigitBtn digit="5" dispatch={dispatch}/>
      <DigitBtn digit="6" dispatch={dispatch}/>
      <OperationtBtn operation="+" dispatch={dispatch}/>
      <DigitBtn digit="7" dispatch={dispatch}/>
      <DigitBtn digit="8" dispatch={dispatch}/>
      <DigitBtn digit="9" dispatch={dispatch}/>
      <OperationtBtn operation="-" dispatch={dispatch}/>
      <DigitBtn digit="." dispatch={dispatch}/>
      <DigitBtn digit="0" dispatch={dispatch}/>
      <button className="span-two" onClick={()=> dispatch({type: ACTIONS.EVALUATE})} >=</button>
    </div>  
  )
}

