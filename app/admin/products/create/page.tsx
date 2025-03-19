import ProductForm from "@/components/admin/product-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Producto",
};

export default function CreateProductPage() {
  return (
    <>
      <h2 className="h2-bold">Crear Producto</h2>
      <div className="my-8">
        <ProductForm type="Crear"></ProductForm>
      </div>
    </>
  );
}
