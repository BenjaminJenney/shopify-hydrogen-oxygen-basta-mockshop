import {CartForm} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';

export async function action({request, context}) {
  // The Skeleton template already has a cart handler which is passed.
  // to the loader and action context.

  const {cart} = context;

  const formData = await request.forData();
  const {action, inputs} = cartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addlines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputed discaount code
      const discountCodes = formDiscountCode ? [formDiscountCode] : [];

      // Combine discount codes already applied to cart
      discountCodes.push(...inputs.discountCodes);
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }
  const headers = cart.setCartId(result.cart.id);
  const {cart: cartResults, errors} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return json(
    {
      cart: cartResults,
      errors,
    },
    {status, headers},
  );
}
