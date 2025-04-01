import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { getLogger } from "./logger-config";
import { APIResponse } from "./api-response";

const logger = getLogger("api-request");

export const APIRequest = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    logger.info(
      {
        "method": req.method,
        "path":   req.baseUrl + req.path,
        "params":  req.params,
        "query": req.query,
      }
    );
    try {
      const result = await fn(req, res, next);
      const response: APIResponse<null> = {
        code: res.statusCode,
        message: "Successfully",
        status: res.statusMessage,
        response: result,
      };
      res.send(response);
    } catch (error) {
      next(error);
    }
  };
};
