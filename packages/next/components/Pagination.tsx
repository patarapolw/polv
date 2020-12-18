import 'twin.macro'

import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Pagination = ({ total }: { total: number }) => {
  const router = useRouter()
  const page = parseInt(router.query.page as string) || 1

  const makePageUrl = (p: number) => {
    let path = router.pathname
    if (!(path.startsWith('/tag') || path.startsWith('/blog'))) {
      path = '/blog'
    }

    path = path.replace(/\/$/, '').replace(/\d+$/, '').replace(/\/$/, '')
    if (p > 1) {
      path += `/${p}`
    }

    if (router.query.q) {
      path += `?q=${encodeURIComponent(router.query.q as string)}`
    }

    return path
  }

  return (
    <section className="my-4 mx-2">
      <nav
        className="pagination is-rounded"
        role="navigation"
        aria-label="pagination"
      >
        {page > 1 ? (
          <Link href={makePageUrl(page - 1)}>
            <a className="pagination-previous">
              <span className="icon">
                <FontAwesomeIcon icon={faCaretLeft} />
              </span>

              <span tw="sr-only">Previous</span>
            </a>
          </Link>
        ) : null}

        {page < total - 1 ? (
          <Link href={makePageUrl(page + 1)}>
            <a className="pagination-next">
              <span className="icon">
                <FontAwesomeIcon icon={faCaretRight} />
              </span>

              <span tw="sr-only">Next</span>
            </a>
          </Link>
        ) : null}

        <ul className="pagination-list">
          {page > 1 ? (
            <li>
              <Link href={makePageUrl(1)}>
                <a className="pagination-link" aria-label="page 1">
                  1
                </a>
              </Link>
            </li>
          ) : null}

          {page > 3 ? (
            <li>
              <span className="pagination-ellipsis"> &hellip; </span>
            </li>
          ) : null}

          {page > 2 ? (
            <li>
              <Link href={makePageUrl(page - 1)}>
                <a className="pagination-link" aria-label={`page ${page - 1}`}>
                  {page - 1}
                </a>
              </Link>
            </li>
          ) : null}

          <li>
            <Link href={makePageUrl(page)}>
              <a
                className="pagination-link is-current"
                aria-label={`page ${page}`}
              >
                {page}
              </a>
            </Link>
          </li>

          {page < total - 1 ? (
            <li>
              <Link href={makePageUrl(page + 1)}>
                <a className="pagination-link" aria-label={`page ${page + 1}`}>
                  {page + 1}
                </a>
              </Link>
            </li>
          ) : null}

          {page < total - 2 ? (
            <li>
              <span className="pagination-ellipsis"> &hellip; </span>
            </li>
          ) : null}

          {page < total ? (
            <li>
              <Link href={makePageUrl(total)}>
                <a className="pagination-link" aria-label={`page ${total}`}>
                  {total}
                </a>
              </Link>
            </li>
          ) : null}
        </ul>
      </nav>
    </section>
  )
}

export default Pagination
