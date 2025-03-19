import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constansts";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
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

// Schema for update products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "El id es requerido"),
});

// Schema for signing users
export const signInFormSchema = z.object({
  email: z.string().email("Dirección de correo inválida"),
  password: z
    .string()
    .min(6, "La contraseña debe tener por lo menos 6 caracteres"),
});

// Schema for signing up users
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Dirección de correo inválida"),
    password: z
      .string()
      .min(6, "La contraseña debe tener por lo menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "La contraseña debe tener por lo menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Cart Schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, "El producto es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  qty: z.number().int().nonnegative("La cantidad debe ser un número positivo"),
  image: z.string().min(1, "La imagen es requerida"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "El id del carrito es requerido"),
  userId: z.string().optional().nullable(),
});

// Schema for the shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  streetAddress: z
    .string()
    .min(3, "La dirección debe tener al menos 3 caracteres"),
  city: z.string().min(3, "La ciudad debe tener al menos 3 caracteres"),
  postalCode: z
    .string()
    .min(3, "El código postal debe tener al menos 3 caracteres"),
  country: z.string().min(3, "El país debe tener al menos 3 caracteres"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Schema for payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "El método de pago es requerido"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Método de Pago Inválido",
  });

//Schema for  Insert order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "El usuario es requerido"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Método de pago inválido",
  }),
  shippingAddress: shippingAddressSchema,
});

//Schema for inserting order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// Schema for updating the user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, "El nombre debe tener por lo menos 3 caracteres"),
  email: z.string().min(3, "El correo debe tener por lo menos 3 caracteres"),
});

// Schema to update users
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "El id es requerido"),
  role: z.string().min(1, "El rol es requerido"),
});
