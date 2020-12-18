import '~/styles/app.scss'

import { THEME } from '~/assets/global'
import Layout from '~/components/Layout'
import { dbPost, initDatabase } from '~/server/db'
import { GetStaticProps } from 'next'
import Head from 'next/head'

// eslint-disable-next-line react/prop-types
const MyApp = ({ Component, pageProps, tagCount }) => {
  return (
    <>
      <Head>
        <title>{THEME.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Layout tagCount={tagCount}>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default MyApp

export const getStaticProps: GetStaticProps = async (ctx) => {
  await initDatabase()

  const tagCount: Record<string, number> = {}
  dbPost.find().map(({ tag = [] }) => {
    return tag.map((t) => {
      tagCount[t] = (tagCount[t] || 0) + 1
      return null
    })
  })

  return {
    props: {
      tagCount
    }
  }
}
