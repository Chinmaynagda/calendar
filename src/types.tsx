export type stateType ={
    todos: Array<todoType>
}

export type todoType ={
    id: string,
    date: string,
    startTime: string,
    endTime: string,
    title: string,
    type: string,
    description: string
}



type LS_obj = {
    startTime: string,
    endTime: string,
    title: string,
    type: string,
    description: string
}

export type hourBoxStyle = {
    marginTop: string,
    height: string,
    backgroundColor: string,
}

export default LS_obj;