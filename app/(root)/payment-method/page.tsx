import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import PaymentMethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
  title: "Selecciona Método de Pago",
};

export default async function PaymentMethodPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Usuario no encontrado");

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={2}></CheckoutSteps>
      <PaymentMethodForm
        preferredPaymentMethod={user.paymentMethod}
      ></PaymentMethodForm>
    </>
  );
}
