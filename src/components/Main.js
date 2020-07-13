import PropTypes from 'prop-types'
import React from 'react'
import ReactModal from 'react-modal'
import { Link } from 'gatsby'

class Main extends React.Component {
  render() {
    let close = (
      <div
        className="close"
        onClick={() => {
          this.props.onCloseArticle()
        }}
      ></div>
    )

    return (
      <div
        ref={this.props.setWrapperRef}
        id="main"
        style={this.props.timeout ? { display: 'flex' } : { display: 'none' }}
      >
        <article
          id="intro"
          className={`${this.props.article === 'intro' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">About Me</h2>
          <p>Hi, I'm Fiza.</p>
          <p>
            I'm a third year student studying Computer Science and Engineering at International Institute of Information Technology, Hyderabad.
          </p>
            <p>Currently I'm working with the organisation <a href="https://github.com/codezonediitj">CodeZoned</a> to implement the code for AdaBoost multi-class classification algorithm. You can read about my work on my blog.
          </p>
          {close}
        </article>

        <article
          id="work"
          className={`${this.props.article === 'work' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">Blog</h2>
          <p>Welcome to my blog!</p>
          <p>
            The purpose of the blog is to provide an acute insight into the weekly functioning of the project.
          </p>
          <p>
          <Link to="/week1">Week 1</Link>
          <br></br>
          <Link to="/week2">Week 2</Link>
          <br></br>
          <Link to="/week3">Week 3</Link>
          </p>
          {close}
        </article>

        <article
          id="contact"
          className={`${this.props.article === 'contact' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">Contact</h2>
          <p>Get in touch!</p>
          <ul className="icons">
            <li>
              <a
                href="https://www.linkedin.com/in/fiza-husain-57a387167/"
                className="icon fa-linkedin"
              >
                <span className="label">LinkedIn</span>
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/fiza.husain.7" className="icon fa-facebook">
                <span className="label">Facebook</span>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/fizahusainn/" className="icon fa-instagram">
                <span className="label">Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/fiza11"
                className="icon fa-github"
              >
                <span className="label">GitHub</span>
              </a>
            </li>
          </ul>
          {close}
        </article>
      </div>
    )
  }
}

Main.propTypes = {
  onOpenArticle: PropTypes.func,
  route: PropTypes.object,
  article: PropTypes.string,
  articleTimeout: PropTypes.bool,
  onCloseArticle: PropTypes.func,
  timeout: PropTypes.bool,
  setWrapperRef: PropTypes.func.isRequired,
}

export default Main
