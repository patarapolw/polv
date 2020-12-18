import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { THEME } from '~/assets/global'
import tw from '~/styles/tw.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, createRef, useEffect, useState } from 'react'

const Layout = ({
  tagCount,
  children
}: {
  tagCount: Record<string, number>
  children: ReactNode | ReactNode[]
}) => {
  const router = useRouter()

  const [isTablet, setTablet] = useState(false)
  const [isNavExpanded, setNavExpanded] = useState(false)
  const [q, setQ] = useState(router.query.q as string)

  const twitterRef = createRef<HTMLAnchorElement>()

  const computedTags = Object.keys(tagCount)
    .sort((a, b) => {
      const primary = tagCount[b] - tagCount[a]
      if (primary) {
        return primary
      }
      return a.localeCompare(b)
    })
    .slice(0, 30)
    .map((t) => {
      return {
        name: t,
        class: (() => {
          const count = tagCount[t]
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
        })()
      }
    })
    .filter((el) => el)

  useEffect(() => {
    setTablet(matchMedia('(max-width: 600px)').matches)
  }, [0])

  return (
    <section>
      <nav
        className="navbar has-shadow is-fixed-top"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link href="/">
            <a className="navbar-item">
              <h1 style={{ fontWeight: 700 }}>{THEME.banner}</h1>
            </a>
          </Link>

          <div className={tw['flex-grow']}></div>

          {THEME.social && isTablet ? <PageSocial /> : null}

          <a
            role="button"
            className={
              'navbar-burger burger' + (isNavExpanded ? ' is-active' : '')
            }
            aria-label="menu"
            aria-expanded={isNavExpanded}
            tabIndex={0}
            data-target="navbarMain"
            onClick={() => setNavExpanded(!isNavExpanded)}
            onKeyPress={() => setNavExpanded(!isNavExpanded)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          id="navbarMain"
          className={'navbar-menu' + (isNavExpanded ? ' is-active' : '')}
        >
          <div className="navbar-start">
            {(THEME.tabs || []).map((t) => (
              <Link key={t.id} href={`/tab/${t.id}`}>
                <a>{t.name}</a>
              </Link>
            ))}
          </div>

          <div className="navbar-end">
            {THEME.social && !isTablet ? (
              <PageSocial className={tw['mobile:w-full']} />
            ) : null}

            <form
              className="field has-addons m-2 px-2"
              onSubmit={(ev) => {
                if (router.pathname.startsWith('/post/')) {
                  ev.preventDefault()
                  router.push(`/blog?q=${encodeURIComponent(q)}`)
                }
              }}
            >
              <div className="control is-expanded" role="search">
                <input
                  value={q}
                  onInput={(ev) => setQ((ev.target as HTMLInputElement).value)}
                  className="input"
                  type="search"
                  placeholder="Search"
                  aria-label="search"
                />
              </div>

              <div className="control">
                <button
                  className="button"
                  style={{
                    borderTopRightRadius: '100%',
                    borderBottomRightRadius: '100%'
                  }}
                >
                  <span className="icon">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </nav>

      <article style={{ marginTop: '60px' }}>
        <div className="container">
          <div className="columns">
            <main
              className={
                'column mt-4' + THEME.sidebar
                  ? 'is-6-desktop is-offset-1-desktop'
                  : 'is-8-desktop is-offset-2-desktop'
              }
            >
              {children}
            </main>

            {THEME.sidebar ? (
              <aside className="column is-4">
                {THEME.sidebar.tagCloud ? (
                  <section className="card mt-4">
                    <header className="card-header">
                      <h3 className="card-header-title">Tag Cloud</h3>
                    </header>

                    <article className="card-content">
                      {computedTags.map((t) => (
                        <span key={t.name} className="el-tag mr-2">
                          <Link href={`/tag/${t.name}`}>
                            <a className={t.class}>{t.name}</a>
                          </Link>
                        </span>
                      ))}
                    </article>
                  </section>
                ) : null}

                {THEME.sidebar.twitter ? (
                  <section className="card mt-4">
                    <a
                      ref={twitterRef}
                      className="twitter-timeline"
                      data-height="800"
                      href={`https://twitter.com/${THEME.sidebar.twitter}`}
                    >
                      Tweets by {THEME.sidebar.twitter}
                    </a>
                  </section>
                ) : null}
              </aside>
            ) : null}
          </div>
        </div>
      </article>
    </section>
  )
}

export default Layout
