import OpenAPIClientAxios from 'openapi-client-axios'

import { Client } from '../types/openapi'

export const apiURL =
  process.env.BASE_URL || `http://localhost:${process.env.SERVER_PORT}`

export const apiDefintionURL = `${apiURL}/api/doc/json`

export const apiClient = new OpenAPIClientAxios({
  definition: apiDefintionURL,
})

// eslint-disable-next-line import/no-mutable-exports
export let api: Client

export async function initAPI() {
  if (api) {
    return api
  }

  api = await apiClient.init<Client>()
  api.defaults.baseURL = apiURL
  return api
}
