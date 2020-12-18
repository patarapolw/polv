import 'twin.macro'

import { THEME } from '~/assets/global'
import type { IPost } from '~/server/db'
import styles from '~/styles/PostFull.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { createRef, useEffect } from 'react'

import PostHeader from './PostHeader'

const PostFull = (post: IPost) => {
  const remark42Ref = createRef<HTMLDivElement>()

  const initRemark42 = () => {
    if (window.remark42Instance) {
      window.remark42Instance.destroy()
    }

    window.remark42Instance = window.REMARK42.createInstance({
      ...THEME.comment.remark42,
      node: remark42Ref.current,
      host: THEME.comment.remark42.host,
      site_id: THEME.comment.remark42.siteId
    })
  }

  useEffect(() => {
    if (window.REMARK42) {
      initRemark42()
    } else {
      window.addEventListener('REMARK42::ready', () => {
        initRemark42()
      })
    }
  }, [remark42Ref.current])

  return (
    <section>
      <article className="card mb-4">
        <div className="card-content">
          <PostHeader date={post.date} />

          {post.image ? (
            <div className={styles.HeaderImage}>
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={300}
              />
            </div>
          ) : null}

          <h1 className="title">{post.title}</h1>

          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          ></div>

          {post.tag ? (
            <div tw="break-words">
              <span className="mr-2">Tags:</span>
              {post.tag.map((t) => (
                <span className="mr-2" key={t}>
                  <Link href={`/tag/${t}`}>
                    <a>{t}</a>
                  </Link>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>

      {THEME.comment?.remark42 ? (
        <footer className="card my-4">
          <div className="card-content">
            <div ref={remark42Ref} />
          </div>
        </footer>
      ) : null}
    </section>
  )
}

export default PostFull
