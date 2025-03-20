import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product.actions";
import Link from "next/link";

const prices = [
  {
    name: "$1 a $50",
    value: "1-50",
  },
  {
    name: "$51 a $100",
    value: "51-100",
  },
  {
    name: "$101 a $200",
    value: "101-200",
  },
  {
    name: "$201 a $500",
    value: "201-500",
  },
  {
    name: "$501 a $1000",
    value: "501-1000",
  },
];

const ratings = [4, 3, 2, 1];

const sortOders = ["más nuevos", "más bajo", "más alto", "valoraciones"];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "todas",
    category = "todas",
    price = "todas",
    rating = "todas",
  } = await props.searchParams;

  const isQuerySet = q && q !== "todas" && q.trim() !== "";
  const isCategorySet =
    category && category !== "todas" && category.trim() !== "";
  const isPriceSet = price && price !== "todas" && price.trim() !== "";
  const isRatingSet = rating && rating !== "todas" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Buscar ${isQuerySet ? q : ""} 
      ${isCategorySet ? `: Categoría ${category}` : ""}
      ${isPriceSet ? `: Precio ${price}` : ""}
      ${isRatingSet ? `: Valoraciones ${rating}` : ""}`,
    };
  } else {
    return {
      title: "Buscar Productos",
    };
  }
}

export default async function SearchPage(props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const {
    q = "todas",
    category = "todas",
    price = "todas",
    rating = "todas",
    sort = "más nuevos",
    page = "1",
  } = await props.searchParams;

  // Construct filter url
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* Category Links */}
        <div className="text-xl mb-2 mt-3">Departamento</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (category === "todas" || category === "") && "font-bold"
                }`}
                href={getFilterUrl({ c: "todas" })}
              >
                Todas
              </Link>
            </li>

            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  className={`${category === x.category && "font-bold"}`}
                  href={getFilterUrl({ c: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Price Links */}
        <div>
          <div className="text-xl mb-2 mt-8">Precio</div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${price === "todas" && "font-bold"}`}
                href={getFilterUrl({ p: "todas" })}
              >
                Todas
              </Link>
            </li>

            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  className={`${price === p.value && "font-bold"}`}
                  href={getFilterUrl({ p: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ratings Links */}
        <div>
          <div className="text-xl mb-2 mt-8">Valoraciones</div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${rating === "todas" && "font-bold"}`}
                href={getFilterUrl({ r: "todas" })}
              >
                Todas
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`${rating === r.toString() && "font-bold"}`}
                  href={getFilterUrl({ r: `${r}` })}
                >
                  {`${r} estrellas o más`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== "todas" && q !== "" && "Consulta: " + q}
            {category !== "todas" &&
              category !== "" &&
              "Categoría: " + category}
            {price !== "todas" && " Precio: " + price}
            {rating !== "todas" && " Valoración: " + rating + " o más"}
            &nbsp;
            {(q !== "todas" && q !== "") ||
            (category !== "todas" && category !== "") ||
            rating !== "todas" ||
            price !== "todas" ? (
              <Button variant="link" asChild>
                <Link href="/search">Limpiar</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Ordenar por{" "}
            {sortOders.map((s) => (
              <Link
                key={s}
                className={`mx-2 ${sort == s && "font-bold"}`}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No se encontraron productos</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product}></ProductCard>
          ))}
        </div>
      </div>
    </div>
  );
}
