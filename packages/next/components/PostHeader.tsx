import tw from "~/styles/tw.module.css";
import dayjs from "dayjs";

const PostHeader = (post: any) => {
  const author = JSON.parse(process.env.author!);
  const m = post.date ? dayjs(post.date) : null;
  const dateString = m ? m.format("ddd D MMMM YYYY") : "";

  return (
    <section className="mb-4">
      <a
        className="el-author"
        href={author.url}
        target="_blank"
        rel="noreferrer noopener nofollow"
      >
        <span className="image">
          <img className="is-rounded" src={author.image} alt={author.name} />
        </span>
        <span>{author.name}</span>
      </a>

      <div className={tw["flex-grow"]} />

      <div>{dateString}</div>

      <style jsx>{`
        section:first-child {
          display: flex;
          flex-direction: row;
          white-space: nowrap;
          overflow: auto;
        }

        .el-author {
          display: flex;
          flex-direction: row;
          white-space: nowrap;
          justify-content: center;
        }

        .el-author img {
          border: none;
          display: block;
          width: 24px;
          min-width: 24px;
        }

        .el-author span + span {
          margin-left: 0.5rem;
        }
      `}</style>
    </section>
  );
};

export default PostHeader;
