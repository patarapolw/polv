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
  /**
   * getEntryList
   */
  'getEntryList'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
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
  ['/api/q']: {
    /**
     * getEntryList
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
