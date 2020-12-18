import 'twin.macro'

import { THEME } from '~/assets/global'
import styles from '~/styles/PostHeader.module.scss'
import Image from 'next/image'

const PostHeader = (post: { date?: number }) => {
  return (
    <section className={styles.PostHeader}>
      <a
        href={THEME.author.url}
        className={styles.author}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="image">
          <Image
            src={THEME.author.image}
            alt={THEME.author.name}
            className="is-rounded"
            width={24}
            height={24}
          />
        </span>

        <span>{THEME.author.name}</span>
      </a>

      <div className={styles.PostHeader_row}>
        <div className={styles.spacer} />

        {post.date ? (
          <div>
            {new Date(post.date).toLocaleDateString([], {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short'
            })}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default PostHeader
