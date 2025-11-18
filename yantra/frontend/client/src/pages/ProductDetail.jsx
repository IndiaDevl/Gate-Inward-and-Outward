import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetail(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{ fetchProduct(); }, [id]);

  async function fetchProduct(){
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE || 'http://localhost:5200/'}api/products/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error||'Failed');
      setProduct(data);
    } catch(err) {
      console.error(err);
    }
  }

  if (!product) return <div>Loading product...</div>;

  return (
    <div>
      <button onClick={()=>navigate(-1)} className="small">Back</button>
      <h2>{product.yantraName}</h2>
      <img src={product.imageURL || 'https://via.placeholder.com/400'} alt={product.yantraName} style={{maxWidth:400}} />
      <p>{product.brandDesc}</p>
      <p><b>Price:</b> ₹{Number(product.productPrice).toFixed(2)}</p>
      <p><b>Stock:</b> {product.stockQuantity}</p>
    </div>
  );
}
