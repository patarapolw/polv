import type { ITheme } from '@polv/server/lib/db/mongo'
import { actionTree, getAccessorType, mutationTree } from 'typed-vuex'

const state = () =>
  new (class {
    theme: ITheme = JSON.parse(process.env.THEME!)
  })()

const mutations = mutationTree(state, {
  SET_THEME(state, theme: ITheme) {
    state.theme = theme
  },
})

const actions = actionTree(
  { state, mutations },
  {
    // async nuxtServerInit({ commit }) {
    //   const theme = await this.$axios.$get('/api/theme.json')
    //   commit('SET_THEME', theme)
    // },
  }
)

// This compiles to nothing and only serves to return the correct type of the accessor
export const accessorType = getAccessorType({
  state,
  mutations,
  actions,
})
