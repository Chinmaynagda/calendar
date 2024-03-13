import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../features/todo/todoSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer,PersistConfig } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";


const persistConfig ={
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig,todoReducer);

export const store = configureStore({
    reducer: persistedReducer
})

export const persistor = persistStore(store);