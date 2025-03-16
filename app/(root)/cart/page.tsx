import { getMyCart } from "@/lib/actions/cart.actions";
import CartTable from "./cart-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrito de Compras",
};

export default async function CartPage() {
  const cart = await getMyCart();

  return (
    <>
      <CartTable cart={cart}></CartTable>
    </>
  );
}
