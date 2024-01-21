import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {getPaginationVariables} from '@shopify/hydrogen';

import ProductGrid from '~/components/ProductGrid';

const seo = ({data}: any) => ({
  title: data?.collection?.title,
  description: data?.collection?.description.substr(0, 154),
});

export const handle = {
  seo,
};

export const loader = async ({
  params,
  context,
  request,
}: LoaderFunctionArgs) => {
  const handle = params.handle;
  const paginationVariables = getPaginationVariables(request, {pageBy: 4});

  if (!handle) {
    throw new Response('Not Found', {status: 404});
  }
  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      ...paginationVariables,
      handle,
    },
  });

  // Handle 404s
  if (!collection) {
    throw new Response(null, {status: 404});
  }

  return json({
    collection,
  });
};
export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  return (
    <>
      <header className="grid w-full gap-8 py-8 justify-items-start">
        <h1 className="text-4xl whitespace-pre-wrap font-bold inline-block">
          {collection.title}
        </h1>
        {collection.description && (
          <div className="flex items-baseline justify-between w-full">
            <p className="max-w-md whitespace-pre-wrap inherit text-copy inline-block">
              {collection.description}
            </p>
          </div>
        )}
      </header>
      <ProductGrid
        collection={collection}
        url={`/collection/${collection.handle}`}
      />
    </>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(first: 4) {
        nodes {
          id
          title
          publishedAt
          handle
          variants(first: 1) {
            nodes {
              id
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
`;
