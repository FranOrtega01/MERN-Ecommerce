import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProductsListContainer } from './Components/Products/ProductsListContainer';
import { Navbar } from './Components/Navbar/Navbar';
import { Sidebar } from './Components/Sidebar/Sidebar';

import './App.scss'

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch('http://127.0.0.1:8080/api/products')
      .then(res => res.json())
      .then(data => {
        const updatedProducts = data.payload.map(product => ({
          ...product,
          thumbnails: product.thumbnails.map(url => `http://127.0.0.1:8080${url}`)
        }));
        setProducts({ ...data, payload: updatedProducts });
        setLoading(false);
      });
  }, []);

  return { products, loading };
}

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { products, loading } = useProducts();
  return (
    <>
      <Navbar open={sidebarOpen} />
      <div className={sidebarOpen ? "main active" : "main"}>
        <Sidebar handleSidebar={setSidebarOpen} />
        <ProductsListContainer loading={loading} products={products} />
      </div>
    </>
  )
}

export default App

