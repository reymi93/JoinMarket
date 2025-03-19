import { auth } from "@/auth";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ordenes Administrador",
};

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ page: string; query: string }>;
}) {
  const { page = "1", query: searchText } = await props.searchParams;

  const session = await auth();

  if (session?.user?.role !== "admin") throw new Error("Usuario no autorizado");

  const orders = await getAllOrders({
    page: Number(page),
    query: searchText,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Ordenes</h1>
        {searchText && (
          <div>
            Filtrado por <i>&quot;{searchText} &quot;</i>{" "}
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                Remover Filtro
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>FECHA</TableHead>
              <TableHead>COMPRADOR</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAGADO</TableHead>
              <TableHead>ENTREGADO</TableHead>
              <TableHead>ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : "No pagada"}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : "No entregada"}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/order/${order.id}`}>Detalles</Link>
                  </Button>
                  <DeleteDialog
                    id={order.id}
                    action={deleteOrder}
                  ></DeleteDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={orders?.totalPages}
          ></Pagination>
        )}
      </div>
    </div>
  );
}
