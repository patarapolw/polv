import { ITheme, zTheme } from '~/server/db/mongo'
import { actionTree, getAccessorType, mutationTree } from 'typed-vuex'
import * as z from 'zod'

const state = () =>
  new (class {
    theme = zTheme.parse(JSON.parse(z.string().parse(process.env.THEME)))
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
