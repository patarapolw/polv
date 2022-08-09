<template>
  <section>
    <nav class="navbar has-shadow is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a href="/" class="navbar-item">
          <h1 style="font-weight: 700">{{ banner }}</h1>
        </a>

        <div :class="$style['flex-grow']" />

        <PageSocial v-if="$mq === 'tablet'" />

        <a role="button" class="navbar-burger burger" :class="{ 'is-active': isNavExpanded }" aria-label="menu"
          :aria-expanded="isNavExpanded" tabIndex="0" data-target="navbarMain" @click="isNavExpanded = !isNavExpanded"
          @keypress="isNavExpanded = !isNavExpanded">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarMain" class="navbar-menu" :class="{ 'is-active': isNavExpanded }">
        <div class="navbar-start">
          <a v-for="t in tabs" :key="t.href || t.id" class="navbar-item" :href="t.href || ('/tab/' + t.id)"
            :target="t.href ? '_blank' : ''" :rel="t.href ? 'noopener nofollow noreferrer' : undefined">
            {{ t.name }}
          </a>
        </div>

        <div class="navbar-end">
          <PageSocial v-if="$mq !== 'tablet'" class="mobile:w-full" />

          <form class="field has-addons m-2 px-2" @submit.prevent="$router.push(`/blog?q=${q}`)">
            <div class="control is-expanded" role="search">
              <input v-model="q" class="input" type="search" placeholder="Search" aria-label="search" />
            </div>

            <div class="control">
              <button class="button" style="
                  border-top-right-radius: 100%;
                  border-bottom-right-radius: 100%;
                ">
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
          <main class="column mt-4 is-6-desktop is-offset-1-desktop">
            <Content />
          </main>

          <aside class="column is-4">
            <section class="card mt-4">
              <header class="card-header">
                <h3 class="card-header-title">Tag Cloud</h3>
              </header>

              <article class="card-content">
                <span v-for="t in computedTags" :key="t.name" class="el-tag mr-2">
                  <a :href="`/tag/${t.name}`" :class="t.class">{{
                      t.name
                  }}</a>
                </span>
              </article>
            </section>

            <section class="card mt-4">
              <a ref="twitter" class="twitter-timeline" data-height="800" :href="`https://twitter.com/patarapolw`">
                {{ `Tweets by patarapolw` }}
              </a>
            </section>
          </aside>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'

const banner = "polv's coding blog"
const tabs: {
  name: string
  id: string
  q: string
}[] = [
    {
      "name": "Pinned",
      "id": "pinned",
      "q": "category:pinned"
    },
    {
      "name": "Health",
      "id": "health",
      "q": "tag:health"
    },
    {
      "name": "Windows",
      "id": "windows",
      "q": "category:windows"
    },
    {
      "name": "macOS",
      "id": "macos",
      "q": "category:macos"
    },
    {
      "name": "Linux",
      "id": "linux",
      "q": "category:linux"
    },
    {
      "name": "Cross-platform",
      "id": "crossplatform",
      "q": "tag:crossplatform"
    }
  ]

const tagCloudData = JSON.parse('{}') // TODO: load from file
const excluded = new Set<string>([])
const computedTags: {
  name: string
  class: string
}[] = Object.keys(tagCloudData)
  .sort((a, b) => {
    const primary = tagCloudData[b] - tagCloudData[a]
    if (primary) {
      return primary
    }
    return a.localeCompare(b)
  })
  .slice(0, 30)
  .map((t) => {
    if (excluded.has(t)) {
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

const q = ref('')
const isNavExpanded = ref(false)

const router = useRouter()

function onSearch() {
  router.go(`/search?q=${encodeURIComponent(q.value)}`)
}

onMounted(() => {
  document.body.append(Object.assign(document.createElement('script'), {
    src: 'https://platform.twitter.com/widgets.js',
    charSet: 'utf-8',
    async: true
  }))
})
</script>

<style module scoped src="./tw.module.css">
</style>

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
