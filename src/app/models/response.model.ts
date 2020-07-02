/* eslint-disable */

interface ResponseBody {
    responseMetaData: {
        statusCode: number;
        requestId: string;
        api: string;
    };
    responsePayloadData: {
        data: object | string | number | object[] | string[] | number[];
    };
}

interface ErrorResponseBody {
    statusCode: number;
    requestId: string;
    api: string;
    message: string;
    stackTrace: string | object;
}

export class CustomResponse {
    private response: ResponseBody;

    constructor(statusCode: number, requestId: string, path: string, payload: ResponseBody['responsePayloadData']['data']) {
      this.response = {
        responseMetaData: {
          statusCode,
          requestId,
          api: path,
        },
        responsePayloadData: {
          data: payload,
        },
      };
    }

    getResponse = (): ResponseBody => this.response;
}

export class CustomErrorResponse {
    private errorResponse: ErrorResponseBody;

    constructor(statusCode: number, requestId: string, path: string, message: string, stackTrace: {[key: string]: string}) {
      this.errorResponse = {
        statusCode,
        requestId,
        api: path,
        message,
        stackTrace: stackTrace.stack,
      };
    }

    getErrorResponse = (): ErrorResponseBody => {
      /* Remove stack trace from production errors */
      if (process.env.NODE_ENV && 'PRODUCTION'.includes(process.env.NODE_ENV.toUpperCase())) delete this.errorResponse.stackTrace;
      return this.errorResponse;
    }
}
