"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { converToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult } from "@/types";
import { PAGE_SIZE } from "../constansts";

// Create order and create order items
export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("Usuario no autenticado");

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Usuario no encontrado");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Tu carrito está vacío",
        redirecTo: "/cart",
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: "No existe dirección de envío",
        redirecTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No existe método de pago",
        redirecTo: "/payment-method",
      };
    }

    // Create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    // Create a transaction to create order and order items in the database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order
      const insertedOrder = await tx.order.create({ data: order });
      // Create order item from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      // Clear cart
      await tx.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Orden no creada");

    return {
      success: true,
      message: "Orden creada",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });
  return converToPlainObject(data);
}

// Update order to paid
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  // Get order from database
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
    },
  });

  if (!order) throw new Error("Orden no encontrada");

  if (order.isPaid) throw new Error("La orden está pagada");

  // Transaction to update order for product stock
  await prisma.$transaction(async (tx) => {
    // Iterate over products and update the stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: { stock: { increment: -item.qty } },
      });
    }

    // Set the order to paid
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  // Get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!updatedOrder) throw new Error("Orden no encontrada");
}

// Get user orders
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error("Usuario no autorizado");

  const data = await prisma.order.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: {
      userId: session?.user?.id,
    },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
