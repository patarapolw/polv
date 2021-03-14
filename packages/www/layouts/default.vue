<template>
  <section>
    <nav
      class="navbar has-shadow is-fixed-top"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <nuxt-link to="/" class="navbar-item">
          <h1 style="font-weight: 700">{{ banner }}</h1>
        </nuxt-link>

        <div :class="$style['flex-grow']" />

        <PageSocial v-if="hasSocial && $mq === 'tablet'" />

        <a
          role="button"
          class="navbar-burger burger"
          :class="{ 'is-active': isNavExpanded }"
          aria-label="menu"
          :aria-expanded="isNavExpanded"
          tabIndex="0"
          data-target="navbarMain"
          @click="isNavExpanded = !isNavExpanded"
          @keypress="isNavExpanded = !isNavExpanded"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarMain"
        class="navbar-menu"
        :class="{ 'is-active': isNavExpanded }"
      >
        <div class="navbar-start">
          <component
            :is="t.href ? 'a' : 'nuxt-link'"
            v-for="t in tabs"
            :key="t.id"
            class="navbar-item"
            :to="'/tab/' + t.id"
            :target="t.href ? '_blank' : ''"
            rel="noopener nofollow noreferrer"
          >
            {{ t.name }}
          </component>
        </div>

        <div class="navbar-end">
          <PageSocial
            v-if="hasSocial && $mq !== 'tablet'"
            class="mobile:w-full"
          />

          <form
            class="field has-addons m-2 px-2"
            @submit.prevent="$router.push(`/blog?q=${q}`)"
          >
            <div class="control is-expanded" role="search">
              <input
                v-model="q"
                class="input"
                type="search"
                placeholder="Search"
                aria-label="search"
              />
            </div>

            <div class="control">
              <button
                class="button"
                style="
                  border-top-right-radius: 100%;
                  border-bottom-right-radius: 100%;
                "
              >
                <span class="icon">
                  <FontAwesome icon="search" />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </nav>

    <article style="margin-top: 60px">
      <div class="container">
        <div class="columns">
          <main
            class="column mt-4"
            :class="
              sidebar
                ? 'is-6-desktop is-offset-1-desktop'
                : 'is-8-desktop is-offset-2-desktop'
            "
          >
            <nuxt />
          </main>

          <aside v-if="sidebar" class="column is-4">
            <section v-if="sidebar.tagCloud" class="card mt-4">
              <header class="card-header">
                <h3 class="card-header-title">Tag Cloud</h3>
              </header>

              <article class="card-content">
                <span
                  v-for="t in computedTags"
                  :key="t.name"
                  class="el-tag mr-2"
                >
                  <nuxt-link :to="`/tag/${t.name}`" :class="t.class">{{
                    t.name
                  }}</nuxt-link>
                </span>
              </article>
            </section>

            <client-only>
              <section v-if="sidebar.twitter" class="card mt-4">
                <a
                  ref="twitter"
                  class="twitter-timeline"
                  data-height="800"
                  :href="`https://twitter.com/${sidebar.twitter}`"
                >
                  {{ `Tweets by ${sidebar.twitter}` }}
                </a>
              </section>
            </client-only>
          </aside>
        </div>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { normalizeArray } from '@/assets/util'
import PageSocial from '@/components/PageSocial.vue'

// eslint-disable-next-line no-use-before-define
@Component<BlogLayout>({
  components: {
    PageSocial,
  },
  async fetch() {
    const tagCloudData: Record<string, number> = await this.$axios.$get(
      '/api/tag.json'
    )
    Object.keys(tagCloudData)
      .sort((a, b) => {
        const primary = tagCloudData[b] - tagCloudData[a]
        if (primary) {
          return primary
        }
        return a.localeCompare(b)
      })
      .slice(0, 30)
      .map((t) => {
        if (
          this.sidebar?.tagCloud?.excluded &&
          this.sidebar.tagCloud.excluded.includes(t)
        ) {
          return null
        }
        return {
          name: t,
          class: (() => {
            const count = tagCloudData[t]
            // if (count > 20) {
            //   return 'c20'
            // } else
            // if (count > 10) {
            //   return 'c10'
            // } else
            if (count > 5) {
              return 'c5'
            } else if (count > 3) {
              return 'c3'
            } else if (count > 1) {
              return 'c2'
            }
            return 'c1'
          })(),
        }
      })
      .map((el) => el!)
      .filter((el) => el)
  },
})
export default class BlogLayout extends Vue {
  banner: string = this.$accessor.theme.banner
  tabs: any[] = this.$accessor.theme.tabs || []
  sidebar: any = this.$accessor.theme.sidebar || null
  hasSocial: boolean = !!this.$accessor.theme.social
  computedTags: {
    name: string
    class: string
  }[] = []

  q = ''
  isNavExpanded = false

  head() {
    const url = this.$accessor.theme.baseUrl + this.$route.path

    return {
      link: [
        {
          rel: 'canonical',
          href: url,
        },
      ],
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: url,
        },
      ],
    }
  }

  mounted() {
    this.q = normalizeArray(this.$route.query.q) || ''

    const { twttr } = window as any
    if (this.sidebar?.twitter) {
      if (twttr) {
        twttr.widgets.load()
      }
    }
  }

  onSearch() {
    this.$router.push({
      path: '/blog',
      query: { q: this.q },
    })
  }
}
</script>

<style module scoped src="~/styles/tw.module.css"></style>

<style scoped>
.c20 {
  font-size: 6rem;
}

.c10 {
  font-size: 3rem;
}

.c5 {
  font-size: 1.8rem;
}

.c3 {
  font-size: 1.2rem;
}

.c2 {
  font-size: 0.9rem;
}

.c1 {
  font-size: 0.6rem;
}

@media screen and (max-width: 600px) {
  .mobile\:w-full {
    width: 100%;
  }
}

.el-tag {
  white-space: nowrap;
}

aside article {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
}
</style>
