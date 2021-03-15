import { initAPI } from '~/assets/api'
import { Paths } from '~/types/openapi'
import {
  actionTree,
  getAccessorType,
  getterTree,
  mutationTree,
} from 'typed-vuex'

type ITheme = Paths.GetTheme.Responses.$200

export const state = () => ({
  theme: JSON.parse(process.env.THEME!) as ITheme,
})

export const getters = getterTree(state, {
  tabs(state) {
    return (state.theme.tabs || []).reduce(
      (prev, c) => ({
        ...prev,
        [c.id]: c,
      }),
      {} as Record<
        string,
        {
          name: string
          q: string
        }
      >
    )
  },
})

export const mutations = mutationTree(state, {
  SET_THEME(state, theme: ITheme) {
    state.theme = theme
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    async nuxtServerInit() {
      await initAPI()
    },
  }
)

// This compiles to nothing and only serves to return the correct type of the accessor
export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
})
