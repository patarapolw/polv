import 'twin.macro'

import {
  faFacebookF,
  faGithub,
  faLinkedinIn,
  faQuora,
  faReddit,
  faTwitter
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { THEME } from '~/assets/global'
import { useEffect, useState } from 'react'

const PageSocial = () => {
  const [isMobile, setMobile] = useState(false)

  useEffect(() => {
    matchMedia('(max-width: 500px)').addEventListener('change', (ev) =>
      setMobile(ev.matches)
    )
  }, [0])

  return (
    <div
      tw={
        'inline-flex justify-center self-center' + (isMobile ? ' w-full' : '')
      }
    >
      {THEME.social?.facebook ? (
        <a
          href={`https://facebook.com/${THEME.social.facebook}`}
          className="navbar-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon">
            <FontAwesomeIcon icon={faFacebookF} />
          </span>
        </a>
      ) : null}

      {THEME.social?.twitter ? (
        <a
          href={`https://twitter.com/${THEME.social.twitter}`}
          className="navbar-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon">
            <FontAwesomeIcon icon={faTwitter} />
          </span>
        </a>
      ) : null}

      {THEME.social?.reddit ? (
        <a
          href={`https://www.reddit.com/user/${THEME.social.reddit}`}
          className="navbar-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon">
            <FontAwesomeIcon icon={faReddit} />
          </span>
        </a>
      ) : null}

      {THEME.social?.quora ? (
        <a
          href={`https://www.quora.com/profile/${THEME.social.quora}`}
          className="navbar-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon">
            <FontAwesomeIcon icon={faQuora} />
          </span>
        </a>
      ) : null}

      {THEME.social?.linkedin ? (
        <a
          href={`https://www.linkedin.com/in/${THEME.social.linkedin}`}
          className="navbar-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </span>
        </a>
      ) : null}

      {THEME.social?.github ? (
        <a
          href={`https://github.com/${THEME.social.github}`}
          className="navbar-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon">
            <FontAwesomeIcon icon={faGithub} />
          </span>
        </a>
      ) : null}
    </div>
  )
}

export default PageSocial
