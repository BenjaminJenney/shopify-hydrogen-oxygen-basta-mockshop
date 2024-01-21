import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

export default function ProductCard({product}: any) {
  const {price, compareAtPrice} = product.variants?.nodes[0] || {};
  const isDiscounted = compareAtPrice?.amount > price?.amount;

  return (
    <Link to={`/products/${product.handle}`}>
      <div className="grid gap-6">
        <div className="shadow-md rounded relative">
          {isDiscounted && (
            <label htmlFor="Sale" className="subpixel-antialiased">
              Sale
            </label>
          )}
          <Image data={product.variants.nodes[0].image} alt={product.title} />
        </div>
        <div className="grid gap-1">
          <h3 className="max-w-prose text-copy w-full overflow-hidden whitespace-nowrap text-ellipsis">
            {product.title}
          </h3>
          <div className="flex gap-4">
            <span className="max-w-prose whitespace-pre]-wrap inherit text-copy flex gap-4">
              <Money withoutTrailingZeros data={price} />
              {isDiscounted && (
                <Money withoutTrailingZeros data={compareAtPrice} />
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
