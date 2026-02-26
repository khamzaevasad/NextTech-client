import { Metadata } from "next";
import ProductClient from "./ProductClient";

interface Props {
  params: Promise<{ productSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query GetProduct($input: String!) {
          getProduct(input: $input) {
            productName
            productDesc
            productPrice
            productImages
          }
        }
      `,
      variables: { input: productSlug },
    }),
  });

  const { data } = await res.json();
  const product = data?.getProduct;

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product does not exist",
    };
  }

  return {
    title: product.productName,
    description:
      product.productDesc || `Buy ${product.productName} at NextTech`,
    keywords: [product.productName, "nexttech", "tech", "electronics"],
    openGraph: {
      title: `${product.productName} | NextTech`,
      description:
        product.productDesc || `Buy ${product.productName} at NextTech`,
      images: product.productImages?.[0]
        ? [`${process.env.NEXT_PUBLIC_API_URI}/${product.productImages[0]}`]
        : ["/icon.png"],
    },
  };
}

export default function Page({ params }: Props) {
  return <ProductClient params={params} />;
}
