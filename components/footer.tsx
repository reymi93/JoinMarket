import { APP_NAME } from "@/lib/constansts";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
        {currentYear} {APP_NAME}. Todos los derechos reservados
      </div>
    </footer>
  );
}
