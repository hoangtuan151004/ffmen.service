import { Response } from "express";

interface ResponseHandler {
  success: (res: Response, data: any, message?: string) => void;
  created: (res: Response, data: any, message?: string) => void;
  noContent: (res: Response, message?: string) => void;
  badRequest: (res: Response, message?: string, errors?: any[]) => void;
  notFound: (res: Response, message?: string, resource?: string) => void;
  unauthorized: (res: Response, message?: string) => void;
  forbidden: (res: Response, message?: string) => void;
  internalServerError: (
    res: Response,
    message?: string,
    details?: Record<string, any>
  ) => void;
}

export const responseHandler: ResponseHandler = {
  success: (res, data, message = "Success") => {
    res.status(200).json({
      status: 200,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  created: (res, data, message = "Created") => {
    res.status(201).json({
      status: 201,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  noContent: (res, _message = "No Content") => {
    res.status(204).send();
  },

  badRequest: (res, message = "Bad Request", errors = []) => {
    res.status(400).json({
      status: 400,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  },

  notFound: (res, message = "Not Found", resource = "") => {
    res.status(404).json({
      status: 404,
      message: `${message}: ${resource}`,
      timestamp: new Date().toISOString(),
    });
  },

  unauthorized: (res, message = "Unauthorized") => {
    res.status(401).json({
      status: 401,
      message,
      timestamp: new Date().toISOString(),
    });
  },

  forbidden: (res, message = "Forbidden") => {
    res.status(403).json({
      status: 403,
      message,
      timestamp: new Date().toISOString(),
    });
  },

  internalServerError: (
    res,
    message = "Internal Server Error",
    details = {}
  ) => {
    res.status(500).json({
      status: 500,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  },
};
