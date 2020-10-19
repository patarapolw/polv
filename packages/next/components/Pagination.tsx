import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import tw from "~/styles/tw.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

const Pagination = ({ total }: { total: number }) => {
  const router = useRouter();
  const page = parseInt((router.pathname.match(/\/(\d+)?$/) || [])[1] || "1");

  const setPageUrl = (p: number) => {
    const {
      pathname,
      query: { q },
    } = router;
    const path0 = pathname.replace(/\/(\d+)?$/, "");

    return `${path0 || "/blog"}${p === 1 ? "" : `/${p}`}${
      q ? `?q=${encodeURIComponent(q as string)}` : ""
    }`;
  };

  return (
    <section className="my-4 mx-2">
      <nav
        className="pagination is-rounded"
        role="navigation"
        aria-label="pagination"
      >
        {page > 1 ? (
          <Link href={setPageUrl(page - 1)}>
            <a className="pagination-previous">
              <span className="icon">
                <FontAwesomeIcon icon={faCaretLeft} />
              </span>

              <span className={tw["sr-only"]}>Previous</span>
            </a>
          </Link>
        ) : null}

        {page < total - 1 ? (
          <Link href={setPageUrl(page + 1)}>
            <a className="pagination-next">
              <span className="icon">
                <FontAwesomeIcon icon={faCaretRight} />
              </span>

              <span className={tw["sr-only"]}>Next</span>
            </a>
          </Link>
        ) : null}

        <ul className="pagination-list">
          {page > 1 ? (
            <Link href={setPageUrl(1)}>
              <a className="pagination-link" aria-label="go to page 1">
                1
              </a>
            </Link>
          ) : null}

          {page > 3 ? (
            <li>
              <span className="pagination-ellipsis">&hellip;</span>
            </li>
          ) : null}

          {page > 2 ? (
            <Link href={setPageUrl(page - 1)}>
              <a
                className="pagination-link"
                aria-label={`go to page ${page - 1}`}
              >
                {page - 1}
              </a>
            </Link>
          ) : null}

          <li>
            <Link href={setPageUrl(page)}>
              <a
                className="pagination-link is-current"
                aria-label={`go to page ${page}`}
                aria-current="page"
              >
                {page}
              </a>
            </Link>
          </li>

          {page < total - 1 ? (
            <li>
              <Link href={setPageUrl(page + 1)}>
                <a
                  className="pagination-link"
                  aria-label={`go to page ${page + 1}`}
                >
                  {page + 1}
                </a>
              </Link>
            </li>
          ) : null}

          {page < total - 2 ? (
            <li>
              <span className="pagination-ellipsis">&hellip;</span>
            </li>
          ) : null}

          {page < total ? (
            <Link href={setPageUrl(total)}>
              <a className="pagination-link" aria-label={`go to page ${total}`}>
                {total}
              </a>
            </Link>
          ) : null}
        </ul>
      </nav>
    </section>
  );
};

export default Pagination;
