import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ProductsForm } from "./ProductsForm";

export default function CreateProductPage() {
  const navigate = useNavigate();

  const createProduct = async (values: any) => {
    const token = localStorage.getItem("accessToken");

    await axios.post("http://localhost:3000/product", values, {
      headers: { Authorization: `Bearer ${token}` },
    });

    navigate("/products");
  };

  return (
    <div>
      <h2>Create Product</h2>
      <ProductsForm onSubmit={createProduct} />
    </div>
  );
}
