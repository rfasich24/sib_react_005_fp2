import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MinusIcon, PlusIcon } from "../assets/icons/icon-svg/iconSvg";
import { addCart, removeItem } from "../features/product/productSlice";

const CartProduct = ({ product }) => {
  const { idProduct, quantity } = product.product;
  console.log("🚀 ~ file: CartProduct.js ~ line 8 ~ CartProduct ~ quantity", quantity);
  const [qty, setQty] = useState(quantity);
  const [qtyLimit, setQtyLimit] = useState(quantity);
  const [limitStock, setLimitStock] = useState(false);
  const { products } = useSelector((store) => store.product);
  const { image, price, title, stock } = products.find((item) => item.id === idProduct);
  // console.log("🚀 ~ file: CartProduct.js ~ line 9 ~ CartProduct ~ carts", carts);
  // const { title, image, price, stock } = products.filter((product) => product.id === product.id)[0];
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(plusTotal(totalPay));
  // }, [dispatch, totalPay]);

  // const handleQuantity = (e) => {
  //   e.preventDefault();
  //   setQty(e.target.value);
  // };

  const handleSubtract = () => {
    setQty(qty - 1);

    dispatch(removeItem({ id: idProduct, quantity: qty }));
  };

  const handlePlus = () => {
    setQty(qty + 1);
    dispatch(addCart({ id: idProduct, quantity: qty + 1 }));
  };

  return (
    <tr className="border-t-2 align-top [&>td]:h-24 [&>td]:py-5 [&>td]:pr-5">
      <td>
        <img src={image} alt="" className="w-28 h-28 object-scale-down" />
      </td>
      <td>
        <span className="font-medium">{title}</span>
      </td>
      <td>
        <span className="font-medium">${price}</span>
      </td>
      <td>
        <div className="flex flex-col">
          <div className="w-32 px-5 py-1 mr-5 bg-slate-50 shadow-md rounded-full flex flex-row justify-between">
            {qty === 0 ? (
              <button className="transition ease-in-out duration-200 hover:text-secondary" disabled>
                <MinusIcon />
              </button>
            ) : (
              <button className="transition ease-in-out duration-200 hover:text-secondary" onClick={handleSubtract}>
                <MinusIcon />
              </button>
            )}
            <input type="number" value={qty} disabled className="min-w-[1rem] rounded-full text-center" />
            {stock === 0 ? (
              <button className="transition ease-in-out duration-200 hover:text-secondary" disabled>
                max
              </button>
            ) : (
              <button className="transition ease-in-out duration-200 hover:text-secondary" onClick={handlePlus}>
                <PlusIcon />
              </button>
            )}
          </div>
          {stock === 0 && <h2 className="text-sm font-medium text-red-500 pt-2">Stock tidak memenuhi</h2>}
        </div>
      </td>
      <td>
        <span className="font-medium">${(quantity * price).toFixed(2)}</span>
      </td>
    </tr>
  );
};

export default CartProduct;