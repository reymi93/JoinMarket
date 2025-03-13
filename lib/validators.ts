import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (value) => /^\d(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "El precio debe tener exactamente dos lugares decimales"
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  slug: z.string().min(3, "El Slug debe tener al menos 3 caracteres"),
  category: z.string().min(3, "La categoría debe tener al menos 3 caracteres"),
  brand: z.string().min(3, "La marca debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres"),
  stock: z.coerce.number(),
  images: z
    .array(z.string())
    .min(1, "El producto debe tener al menos 1 imagen"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// Schema for signing users
export const signInFormSchema = z.object({
  email: z.string().email("Dirección de correo inválida"),
  password: z
    .string()
    .min(6, "La contraseña debe tener por lo menos 6 caracteres"),
});
