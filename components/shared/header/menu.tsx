import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  LucideShoppingCart,
  ShoppingCart,
  UserIcon,
} from "lucide-react";
import ModeToggle from "./mode-toogle";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Menu() {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle></ModeToggle>
        <Button asChild variant="ghost">
          <Link href="/cart">
            <LucideShoppingCart></LucideShoppingCart>Carrito
          </Link>
        </Button>
        <Button asChild>
          <Link href="/sign-in">
            <UserIcon></UserIcon>Iniciar Sesión
          </Link>
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle></ModeToggle>
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart />
              </Link>
            </Button>
            <Button asChild>
              <Link href="/sign-in">
                <UserIcon></UserIcon>Iniciar Sesión
              </Link>
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
