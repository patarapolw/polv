import PostHeader from './PostHeader'

const PostTeaser = ({ date }: { date?: number }) => {
  return (
    <section className="card">
      <article className="card-content">
        <PostHeader date={date} />
      </article>
    </section>
  )
}

export default PostTeaser
