import { initAPI } from '~/assets/api'
import { Paths } from '~/types/openapi'
import {
  actionTree,
  getAccessorType,
  getterTree,
  mutationTree,
} from 'typed-vuex'

type ITheme = Paths.GetTheme.Responses.$200

const state = () =>
  new (class {
    theme: ITheme = JSON.parse(process.env.THEME!)
  })()

const getters = getterTree(state, {
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

const mutations = mutationTree(state, {
  SET_THEME(state, theme: ITheme) {
    state.theme = theme
  },
})

const actions = actionTree(
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
