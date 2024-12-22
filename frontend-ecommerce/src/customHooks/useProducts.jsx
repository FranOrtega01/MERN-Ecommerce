import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

export const useProducts = () => {
    // useEffect(() => {
    //     fetch('http://127.0.0.1:8080/api/products')
    //       .then(res => res.json())
    //       .then(data => console.log(data))
    //   }, [])
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
}