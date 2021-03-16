import {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Paths {
  namespace GetEntryOne {
    namespace Parameters {
      export type Path = string;
    }
    export interface QueryParameters {
      path: Parameters.Path;
    }
    namespace Responses {
      export interface $200 {
        title: string;
        date?: string; // date-time
        image?: string;
        tag: string[];
        text: string;
        html: string;
      }
    }
  }
}

export interface OperationMethods {
  /**
   * getEntryOne
   */
  'getEntryOne'(
    parameters?: Parameters<Paths.GetEntryOne.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetEntryOne.Responses.$200>
}

export interface PathsDictionary {
  ['/api/']: {
    /**
     * getEntryOne
     */
    'get'(
      parameters?: Parameters<Paths.GetEntryOne.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetEntryOne.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
