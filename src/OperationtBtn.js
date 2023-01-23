import { ACTIONS } from "./App"

export default function OperationtBtn({dispatch, operation}){
    return (<button onClick={() => dispatch({type: ACTIONS.CHOOSE_OPERATION , payload:{operation }})}>{operation}</button>)
}