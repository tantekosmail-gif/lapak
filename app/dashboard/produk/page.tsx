import { getProducts } from "@/app/actions/products";
import ProductTable from "./productTable";

export default async function DashboardProdukPage() {
  const products = await getProducts();
  return <ProductTable products={products} />;
}