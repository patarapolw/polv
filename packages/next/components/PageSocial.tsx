import {
  faGithub,
  faQuora,
  faReddit,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import tw from "~/styles/tw.module.css";

const PageSocial = () => {
  const social = JSON.parse(process.env.social!);

  return (
    <div
      className={[
        tw["inline-flex"],
        tw["justify-center"],
        tw["self-center"],
      ].join(" ")}
    >
      {social.twitter ? (
        <a
          className="navbar-item"
          href={`https://twitter.com/${social.twitter}`}
          target="_blank"
          rel="noopener nofollow noreferrer"
        >
          <span className="icon">
            <FontAwesomeIcon icon={faTwitter} />
          </span>
        </a>
      ) : null}

      {social.reddit ? (
        <a
          className="navbar-item"
          href={`https://www.reddit.com/user/${social.reddit}`}
          target="_blank"
          rel="noopener nofollow noreferrer"
        >
          <span className="icon">
            <FontAwesomeIcon icon={faReddit} />
          </span>
        </a>
      ) : null}

      {social.quora ? (
        <a
          className="navbar-item"
          href={`https://www.quora.com/profile/${social.quora}`}
          target="_blank"
          rel="noopener nofollow noreferrer"
        >
          <span className="icon">
            <FontAwesomeIcon icon={faQuora} />
          </span>
        </a>
      ) : null}

      {social.github ? (
        <a
          className="navbar-item"
          href={`https://github.com/${social.github}`}
          target="_blank"
          rel="noopener nofollow noreferrer"
        >
          <span className="icon">
            <FontAwesomeIcon icon={faGithub} />
          </span>
        </a>
      ) : null}
    </div>
  );
};

export default PageSocial;
