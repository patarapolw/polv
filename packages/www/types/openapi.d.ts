import {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Paths {
  namespace GetEntryList {
    namespace Parameters {
      export type Limit = number;
      export type Page = number;
      export type Q = string;
    }
    export interface QueryParameters {
      q?: Parameters.Q;
      page: Parameters.Page;
      limit: Parameters.Limit;
    }
    namespace Responses {
      export interface $200 {
        result: {
          path: string;
          title: string;
          date?: string; // date-time
          image?: string;
          tag: string[];
          html: string;
        }[];
        count: number;
      }
    }
  }
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
  namespace GetTag {
    namespace Responses {
      export interface $200 {
        [name: string]: number;
      }
    }
  }
  namespace GetTheme {
    namespace Responses {
      export interface $200 {
        [name: string]: any;
        title: string;
        banner: string;
        baseUrl: string;
        description?: string;
        favicon: string;
        keywords?: string[];
        tabs?: {
          name: string;
          id: string;
          q: string;
        }[];
        author: {
          [name: string]: any;
          url?: string;
          email?: string;
          name: string;
          image: string;
        };
        social: {
          [name: string]: any;
          facebook?: string;
          twitter?: string;
          reddit?: string;
          quora?: string;
          github?: string;
          linkedin?: string;
        };
        sidebar?: {
          tagCloud?: boolean;
          twitter?: string;
        };
        analytics?: {
          plausible?: string;
        };
        comment?: {
          remark42?: {
            host: string;
            siteId: string;
            locale?: string;
          };
        };
      }
    }
  }
}

export interface OperationMethods {
  /**
   * getTheme
   */
  'getTheme'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetTheme.Responses.$200>
  /**
   * getTag
   */
  'getTag'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetTag.Responses.$200>
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
    parameters?: Parameters<Paths.GetEntryList.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetEntryList.Responses.$200>
}

export interface PathsDictionary {
  ['/api/theme.json']: {
    /**
     * getTheme
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetTheme.Responses.$200>
  }
  ['/api/tag.json']: {
    /**
     * getTag
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetTag.Responses.$200>
  }
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
  ['/api/list']: {
    /**
     * getEntryList
     */
    'get'(
      parameters?: Parameters<Paths.GetEntryList.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetEntryList.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
