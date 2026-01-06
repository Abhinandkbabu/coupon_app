import { products } from "../data/products";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";
import Header from "../components/Header";

export default function Products({ goToCart }) {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-6">
      <Header />

      <h2 className="text-lg font-semibold mb-4">Products</h2>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800 p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-gray-400">₹{product.price}</p>
            </div>

            <button
              onClick={() => dispatch(addToCart(product))}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={goToCart}
        className="fixed bottom-6 right-6 bg-green-600 px-6 py-3 rounded-full"
      >
        Go to Cart
      </button>
    </div>
  );
}
