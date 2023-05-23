import axios from "axios";

import { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: any;
  rating: {
    rate: number;
    count: number;
  };
}

type SortOption =
  | "title_asc"
  | "title_desc"
  | "price_asc"
  | "price_desc"
  | "rating-asc"
  | "rating_desc";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [itemProducts, setItemProducts] = useState<Product[]>([]);
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("title_asc");

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((response) => {
      setProducts(response.data);
      setItemProducts(response.data);
    });
  }, []);

  useEffect(() => {
    // Apply filters to the products when priceFilter or categoryFilter changes
    let filtered = products;

    if (priceFilter !== null) {
      filtered = filtered.filter((product) => product.price <= priceFilter);
    }

    if (categoryFilter !== null) {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }
    if (ratingFilter !== null) {
      filtered = filtered.filter(
        (product) => product.rating.rate >= parseFloat(ratingFilter)
      );
    }

    setItemProducts(filtered);
  }, [priceFilter, categoryFilter, ratingFilter, products]);

  const handlePriceFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | any>
  ) => {
    const price = Number(event.target.value);
    setPriceFilter(price);
  };

  const handleCategoryFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const category = event.target.value;
    setCategoryFilter(category);
  };
  const handleRatingFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const rating = event.target.value;
    setRatingFilter(rating);
  };
  const filteredProducts = products.sort((a, b) => {
    console.log("sortby", sortBy, sortBy === "rating-asc");
    switch (sortBy) {
      case "rating_desc":
        return b.rating.rate - a.rating.rate;
      case "rating-asc":
        return a.rating.rate - b.rating.rate;
      case "title_asc":
        return a.title.localeCompare(b.title);
        break;
      case "title_desc":
        return b.title.localeCompare(a.title);
        break;
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;

      default:
        return 0;
    }
  });
  return (
    <div>
      <div>
        <div>
          <label>
            Price Filter:
            <input type="number" min="0" onChange={handlePriceFilterChange} />
          </label>
        </div>
        <div>
          <label>
            Category Filter:
            <select onChange={handleCategoryFilterChange}>
              <option value="all">All</option>
              <option value="electronics">Electronics</option>
              <option value="women's clothing">Women's Clothing</option>
              <option value="jewelery">Jewelery</option>
              <option value="men's clothing">Men's Clothing</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Rating:
            <select value={ratingFilter} onChange={handleRatingFilterChange}>
              <option value="all">All</option>
              <option value="1-1.9">1+</option>
              <option value="2-2.9">2+</option>
              <option value="3-3.9">3+</option>
              <option value="4-4.9">4+</option>
            </select>
          </label>
        </div>
        <ul>
          {itemProducts.map((product) => (
            <li key={product.id}>
              <p>
                price: --{product.price} - Category: --{product.category}--
                Rating: {product.rating.rate}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label>
          Sort by:
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
          >
            <option value="title_asc">Title (A-Z)</option>
            <option value="title_desc">Title (Z-A)</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="rating-asc">Rating (Low to High)</option>
            <option value="rating_desc">Rating (High to Low)</option>
          </select>
        </label>
      </div>
      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <h2>{product.title}</h2>
            <p>Price: {product.price}</p>
            <p>Rating: {Math.round(product.rating.rate)}</p>
          </li>
        ))}
      </ul>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Id
            </th>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Categoray
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Image
            </th>
            <th scope="col" className="px-6 py-3">
              Rating
            </th>
          </tr>

          {products.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.price}</td>
              <td>{item.category}</td>
              <td>{item.description}</td>
              <td>
                <img src={item.image}></img>
              </td>
              <td>{item.rating.rate}</td>
            </tr>
          ))}
        </thead>
      </table>
    </div>
  );
}
