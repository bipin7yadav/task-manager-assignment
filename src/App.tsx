import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import Index from "./pages/Index.tsx";
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Provider store={store} children >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </BrowserRouter>
  </Provider>
  );
}

export default App;
