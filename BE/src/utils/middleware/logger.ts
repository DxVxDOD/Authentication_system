import { NextFunction, Request, Response } from "express";

export function requestLogger(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  console.log("Mehtod", request.method);
  console.log("Path", request.path);
  console.log("Body", request.body);

  next();
}
