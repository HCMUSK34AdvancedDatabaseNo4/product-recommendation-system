import { NextFunction, Request, Response } from "express";

import { APIResponse } from "./api-response";
import { getLogger } from "./logger-config";
const logger = getLogger("error-handler");

export enum ErrorCode {
    "BadRequest" = 400,
    "Unauthorized" = 401,
    "Forbidden" = 403,
    "NotFound" = 404,
    "Internal Server Error" = 500
  }

  

export default class AppError extends Error {
    statusCode: number;
    status: string;
    message: string;
    constructor(message: string, statusCode?: number) {
      super(message);
      this.statusCode = statusCode ?? 400;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  
      this.message = message;
  
      Error.captureStackTrace(this, this.constructor);
      if (this.statusCode >= 500 && this.stack) {
        logger.error(this.stack);
      }
    }
  }

export class NotFoundError extends AppError {
  constructor(msg: string) {
    super(msg, ErrorCode.NotFound);
  }
}

export class UnauthorizedError extends AppError {
  constructor(msg: string) {
    super(msg, ErrorCode.Unauthorized);
  }
}

export class BadRequestError extends AppError {
  constructor(msg: string) {
    super(msg, ErrorCode.BadRequest);
  }
}


export const errorHanlder = (
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    error = error as AppError;
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
  
    const response: APIResponse<null> = {
      code: error.statusCode,
      message: error.message,
      status: error.status,
      response: null,
    };
    if (error.statusCode >= 500 && error.stack) {
      logger.error(error.stack);
    } else {
      logger.error(response);
    }
    res.status(error.statusCode).json(response);
  };
  