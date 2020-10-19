import "~/assets/remark42";

import Link from "next/link";
import { useRouter } from "next/router";
import { createRef, useEffect } from "react";

import PostHeader from "./PostHeader";

let remark42Instance: any = null;

const router = useRouter();

router.beforePopState(() => {
  if (remark42Instance) {
    remark42Instance.destroy();
  }
  return true;
});

const PostFull = (post: any) => {
  const remark42 = createRef<HTMLDivElement>();

  useEffect(() => {
    const initRemark42 = () => {
      if (process.env.remark42Config && window.REMARK42) {
        if (remark42Instance) {
          remark42Instance.destroy();
        }

        const config = JSON.parse(process.env.remark42Config);

        remark42Instance = window.REMARK42.createInstance({
          node: remark42.current,
          host: config.host,
          site_id: config.siteId,
        });
      }
    };

    if (window.REMARK42) {
      initRemark42();
    } else {
      window.addEventListener("REMARK42::ready", () => {
        initRemark42();
      });
    }
  });

  return (
    <section>
      <article className="card mb-4">
        <div className="card-content">
          <PostHeader {...{ post }} />

          <div v-if="post.image" className="mx-6 mb-4">
            <img
              className="tw-w-full"
              src={post.image}
              alt={post.title}
              style={{ width: "100%" }}
            />
          </div>

          <h1 className="title">{post.title}</h1>

          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <div style={{ overflowWrap: "break-word" }}>
            <span className="mr-2">Tags:</span>
            {(post.tag || []).map((t: string) => {
              return (
                <Link key={t} href={`/tag/${t}`}>
                  <a className="mr-2">{t}</a>
                </Link>
              );
            })}
          </div>
        </div>
      </article>

      <footer v-if="hasComment" className="card my-4">
        <div className="card-content">
          <div ref={remark42} />
        </div>
      </footer>
    </section>
  );
};

export default PostFull;
