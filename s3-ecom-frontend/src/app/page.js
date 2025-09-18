import axios from "axios";
import Image from "next/image";

export default async function Home() {
  const response = await axios.get("http://localhost:3200/products");
  const products = await response.data;

  console.log(products);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
        >
          {/* Product Image */}
          <img
            className="w-full h-48 object-cover"
            width={100}
            height={200}
            src={`https://d13k7wiqvpwy05.cloudfront.net/${product.filename}`}
            alt={product.name}
          />

          {/* Product Details */}
          <div className="p-5">
            <h2 className="text-xl font-semibold text-gray-800 truncate">
              {product.name}
            </h2>

            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
              {product.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-indigo-600">
                ₹{product.price}
              </span>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
