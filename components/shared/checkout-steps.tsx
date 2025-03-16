import React from "react";

import { cn } from "@/lib/utils";

export default function CheckoutSteps({ current = 0 }) {
  return (
    <div className="flex-between  flex-col md:flex-row  space-x-2 space-y-2 mb-10">
      {[
        "Inicio de Usuario",
        "Dirección de Envío",
        "Método de Pago",
        "Termina Orden",
      ].map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "p-2 w-56 rounded-full text-center  text-sm",
              index === current ? "bg-secondary" : ""
            )}
          >
            {step}
          </div>
          {step !== "Termina Orden" && (
            <hr className="w-16 border-t border-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
