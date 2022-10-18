import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import ProductCards from "../components/ProductCards";

const DetailProduct = () => {
  const [quantity, setQuantity] = useState(0);
  const { id } = useParams();
  let { pathname } = useLocation();
  console.log("🚀 ~ file: DetailProduct.js ~ line 10 ~ DetailProduct ~ pathname", pathname);
  const locations = pathname.substring(1).split("/");
  console.log("🚀 ~ file: DetailProduct.js ~ line 11 ~ DetailProduct ~ location", locations);
  const { products } = useSelector((store) => store.product);
  const product = products ? products.filter((product) => product.id === Number(id))[0] : "";
  const relatedProducts = products ? products.filter((relatedProduct) => relatedProduct.category === product.category) : "";
  console.log("🚀 ~ file: DetailProduct.js ~ line 12 ~ DetailProduct ~ relatedProducts", relatedProducts);

  if (product) {
    return (
      <section className="pt-16 pb-28 font-quicksand">
        <div
          className="w-full h-96 bg-fixed overflow-hidden flex justify-center items-center text-center relative"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80)` }}
        >
          <div className="w-full h-full bg-slate-400 mix-blend-multiply"></div>
          <div className="absolute flex flex-col justify-center items-center text-white">
            <h1 className="text-white text-4xl font-semibold">{product.title}</h1>
            <h5 className="w-52 flex justify-evenly items-center capitalize">
              <Link to="/" onClick={() => window.scrollTo(0, 0)} className="font-medium text-lg text-white transition ease-in-out duration-200 hover:text-secondary">
                Home
              </Link>
              <span>&gt;</span>
              {locations.map((location, index) =>
                index + 1 <= locations.length - 1 ? (
                  <Link to={`/${location}`} onClick={() => window.scrollTo(0, 792)} className="font-medium text-lg text-white transition ease-in-out duration-200 hover:text-secondary" key={index}>
                    {location}
                  </Link>
                ) : (
                  ""
                )
              )}
            </h5>
          </div>
        </div>
        <div className="container bg-white py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row justify-center items-center">
            <div className="w-full lg:w-1/2 p-10 flex justify-center">
              <img src={product.image} alt={product.title} className="w-full h-96 object-scale-down" />
            </div>
            <div className="w-full min-h-[29rem] lg:w-1/2 p-4 flex flex-col justify-between">
              <div className="w-full mb-10 lg:mb-0">
                <h1 className="font-semibold text-3xl text-primary">{product.title}</h1>
                <h2 className="font-semibold text-2xl text-secondary mt-3">$ {product.price}</h2>
              </div>
              <div className="w-full border-t-[3px] mb-10 lg:mb-0"></div>
              <div className="w-full mb-10 lg:mb-0">
                <p className="font-medium">{product.description}</p>
              </div>
              <div className="w-full border-t-[3px] mb-10 lg:mb-0"></div>
              <div className="w-full flex items-center mb-10 lg:mb-0">
                <span className="font-medium text-lg mr-10">QTY</span>
                <div className="w-32 px-5 py-1 bg-slate-50 shadow-md rounded-full flex justify-between">
                  <button className="transition ease-in-out duration-200 hover:text-secondary" onClick={() => setQuantity(quantity >= 1 ? quantity - 1 : 0)}>
                    -
                  </button>
                  <span>{quantity}</span>
                  <button className="transition ease-in-out duration-200 hover:text-secondary" onClick={() => setQuantity(quantity < product.quantity ? quantity + 1 : quantity)}>
                    +
                  </button>
                </div>
              </div>
              <div className="full flex mb-10 lg:mb-0">
                <h4 className="font-medium text-base uppercase">
                  Category :{" "}
                  <Link to={`/${product.category.replace(" ", "-")}`} onClick={() => window.scrollTo(0, 792)} className="capitalize text-primary transition ease-in-out duration-300 hover:text-secondary">
                    {product.category}
                  </Link>
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="container pt-32 px-8 lg:px-20 flex flex-col justify-center items-center text-center">
          <h1 className="font-bold text-4xl text-primary border-x-[3px] border-secondary px-10 uppercase">Related Product</h1>
          <div className="pt-16 grid justify-center gap-7 md:grid-cols-2 xl:grid-cols-4">{relatedProducts && relatedProducts.map((item, index) => (index + 1 <= 4 ? <ProductCards item={item} index={index} key={index} /> : ""))}</div>
        </div>
      </section>
    );
  }
};

export default DetailProduct;
