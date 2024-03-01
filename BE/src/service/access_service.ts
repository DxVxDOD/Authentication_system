import Access from "../models/access_model";
import { stringParser } from "../utils/parsers/general_parsers";
import { wrapInPromise } from "../utils/wrap_in_promise";

export async function enableFields(remoteAddress: string | undefined) {
  const { data: remoteAddressString, error: remoteAddressStringError } =
    await wrapInPromise(stringParser(remoteAddress));

  if (!remoteAddressString || remoteAddressStringError) {
    throw new Error(
      "Could not parse remote address: " + remoteAddressStringError.message,
    );
  }

  const { data: access, error: accessError } = await wrapInPromise(
    Access.findOneAndUpdate(
      { remoteAddress: remoteAddressString },
      {
        remoteAddress: remoteAddressString,



        access: true,
        attempts: 0,
      },
    ),
  );

  if (!access || accessError) {
    throw new Error("Error while updating access: " + accessError);
  }

  return access;
}
