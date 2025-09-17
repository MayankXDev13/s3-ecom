"use client";

import axios from "axios";
import React, { useState } from "react";

function CreateProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [filename, setFilename] = useState("");

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) {
        console.error("No file selected");
        return;
      }

      // Extract mime type safely
      const mime = file.type?.split("/")?.[1] || "octet-stream";

      // Request presigned URL from server
      let response;
      try {
        response = await axios.post("http://localhost:3200/get-presigned-url", {
          mime,
        });
      } catch (err) {
        console.error("Failed to get presigned URL:", err.message);
        return;
      }

      if (!response?.data?.url) {
        console.error(
          "Invalid response from server while fetching presigned URL"
        );
        return;
      }

      const { url, finalname } = response.data;
      setFilename(finalname);

      // Upload file to S3
      try {
        const uploadRes = await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        if (uploadRes.status !== 200) {
          console.error("S3 upload failed:", uploadRes.statusText);
          return;
        }

        console.log("✅ File uploaded successfully");
      } catch (err) {
        console.error("Error uploading to S3:", err.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: name,
      description: description,
      price: price,
      filename: filename,
    };

    try {
      const response = await axios.post("http://localhost:3200/products", data);

      console.log("Product created: ", response.data);

      setName("");
      setDescription("");
      setPrice("");
      setFilename("");
    } catch (err) {
      console.log(`Error creating product: ${err}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-l from-blue-600 to-orange-600 ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl  p-6 space-y-4 shadow-2xl"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Create Product
        </h2>

        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            id="name"
            placeholder="Enter product name"
            className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            placeholder="Enter product description"
            rows="3"
            className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Product Image
          </label>
          <input
            onChange={handleImageChange}
            type="file"
            id="image"
            className="mt-1 py-2 px-1 block w-full text-gray-700 border border-gray-300 rounded-xl cursor-pointer focus:border-blue-500 focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            type="number"
            id="price"
            placeholder="Enter price"
            className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-300 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition duration-200"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}

export default CreateProductPage;
