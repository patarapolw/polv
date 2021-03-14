import { actionTree, getAccessorType, mutationTree } from 'typed-vuex'
import * as z from 'zod'

export const zTheme = z
  .object({
    title: z.string(),
    banner: z.string(),
    baseUrl: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    tabs: z
      .array(
        z.object({
          name: z.string(),
          id: z.string(),
          q: z.string(),
        })
      )
      .optional(),
    author: z
      .object({
        url: z.string().optional(),
        email: z.string().optional(),
        name: z.string(),
        image: z.string(),
      })
      .nonstrict(),
    social: z
      .object({
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        reddit: z.string().optional(),
        quora: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
      })
      .nonstrict(),
    sidebar: z
      .object({
        tagCloud: z.boolean().optional(),
        twitter: z.string().optional(),
      })
      .optional(),
    analytics: z
      .object({
        plausible: z.string().optional(),
      })
      .optional(),
    comment: z
      .object({
        remark42: z
          .object({
            host: z.string(),
            siteId: z.string(),
            locale: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .nonstrict()

export type ITheme = z.infer<typeof zTheme>

const state = () =>
  new (class {
    theme!: ITheme
  })()

const mutations = mutationTree(state, {
  SET_THEME(state, theme: ITheme) {
    state.theme = theme
  },
})

const actions = actionTree(
  { state, mutations },
  {
    async nuxtServerInit({ commit }) {
      const theme = await this.$axios.$get('/api/theme.json')
      commit('SET_THEME', theme)
    },
  }
)

// This compiles to nothing and only serves to return the correct type of the accessor
export const accessorType = getAccessorType({
  state,
  mutations,
  actions,
})
