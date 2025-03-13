"use server";

import { converToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constansts";
import { prisma } from "@/db/prisma";

// Get lastest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return converToPlainObject(data);
}

// Get single product
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: {
      slug: slug,
    },
  });
}
