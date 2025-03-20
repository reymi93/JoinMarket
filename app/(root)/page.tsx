import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products-button";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";

export default async function Homepage() {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts}></ProductCarousel>
      )}
      <ProductList
        data={latestProducts}
        title="Arribo mas reciente"
        limit={4}
      ></ProductList>
      <ViewAllProductsButton></ViewAllProductsButton>
    </>
  );
}
