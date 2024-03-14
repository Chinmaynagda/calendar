import { createSlice,nanoid } from "@reduxjs/toolkit";
import { stateType, todoType } from "../../types";



const initialState:stateType = {
    todos:[]
}

export const todoSlice = createSlice({
    name:'todo',
    initialState,
    reducers:{
        addTodo: (state,action) => {
            const todo = {
                id: nanoid(),
                date: action.payload.date,
                startTime: action.payload.startTime,
                endTime: action.payload.endTime,
                title: action.payload.title,
                type: action.payload.type,
                description: action.payload.description
            }
            state.todos.push(todo);
        },
        removeTodo: (state,action) => {
            const id = action.payload;
            state.todos = state.todos.filter((todo) => todo.id!==id)
        },
        editTodo: (state,action) => {
                const id = action.payload.id;            
                const todoToUpdate = state.todos.find(todo => todo.id === id);
            
                if (todoToUpdate) {
                    todoToUpdate.startTime = action.payload.startTime;
                    todoToUpdate.endTime = action.payload.endTime;
                    todoToUpdate.title = action.payload.title;
                    todoToUpdate.type = action.payload.type;
                    todoToUpdate.description = action.payload.description;
            }
        },
    }
})

export const {addTodo,removeTodo,editTodo} = todoSlice.actions;
export  default todoSlice.reducer;