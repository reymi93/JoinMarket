import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export default function IconBoxes() {
  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4">
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-sm font-bold">Envío Gratis</div>
            <div className="text-sm text-muted-foreground">
              Envíos gratis en órdenes por arriba de $100
            </div>
          </div>
          <div className="space-y-2">
            <DollarSign />
            <div className="text-sm font-bold">
              Garantía de devolución de dinero{" "}
            </div>
            <div className="text-sm text-muted-foreground">
              Hasta los 30 días de compra
            </div>
          </div>
          <div className="space-y-2">
            <WalletCards />
            <div className="text-sm font-bold">Pagos flexibles</div>
            <div className="text-sm text-muted-foreground">
              Paga con tarjetas de crédito o en la Entrega
            </div>
          </div>
          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold">Soporte 24/7</div>
            <div className="text-sm text-muted-foreground">
              Consigue soporte en cualquier momento
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
