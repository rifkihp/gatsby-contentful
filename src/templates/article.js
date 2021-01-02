import React, {Component} from 'react'
import PropTypes from 'prop-types'
import SEO from '../components/SEO'
import {BlockSignupForm} from '../components/SubscriptionForm'
import Layout from '../components/Layout'
import {graphql} from 'gatsby'

import {motion} from 'framer-motion'
// Our custom easing
let easing = [0.6, -0.05, 0.01, 0.99]

// animate: defines animation
// initial: defines initial state of animation or stating point.
// exit: defines animation when component exits

// Custom variant
const fadeInLeft = {
  initial: {
    x: 200,
    opacity: 0,
    transition: {duration: 0.6, ease: easing},
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}
class ArticleTemplate extends Component {
  render() {
    const {
      title,
      slug,
      content,
      featureImage,
      publishDate,
      author,
    } = this.props.data.contentfulBlog
    return (
      <Layout location={this.props.location}>
        <motion.div
          initial="initial"
          animate="animate"
          exit={{opacity: 0}}
          className="p-8"
        >
          <SEO
            key={`seo-${slug}`}
            postImage={featureImage ? `https:${featureImage.file.url}` : null}
            postData={{
              frontmatter: {
                slug,
                publishDate,
                title,
                description: content.childMarkdownRemark.excerpt,
              },
            }}
            isBlogPost
          />
          <motion.div variants={stagger}>
            <motion.h2 variants={fadeInLeft} className="text-3xl font-heading">
              {title}
            </motion.h2>
            <motion.span
              variants={fadeInLeft}
              className="inline-block text-sm text-gray-700 border-b broder"
            >
              Published: <time>{publishDate}</time>{' '}
            </motion.span>
            <motion.div
              variants={fadeInLeft}
              className="prose prose-xl container mx-auto"
            >
              <section
                dangerouslySetInnerHTML={{
                  __html: content.childMarkdownRemark.html,
                }}
                className="w-full"
              />
            </motion.div>
          </motion.div>
          <div className="text-sm text-gray">
            <BlockSignupForm />
          </div>
          <div className="container mx-auto mt-5 text-sm text-gray-700">
            <div className="flex flex-wrap">
              <div className="rounded-full overflow-hidden w-24 h-24">
                <img src={author.avatar.file.url} alt={author.avatar.title} />
              </div>
              <div className="w-2/3">
                <div
                  className="px-4"
                  dangerouslySetInnerHTML={{
                    __html: author.bio.childMarkdownRemark.html,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </Layout>
    )
  }
}

ArticleTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object,
}

export default ArticleTemplate

export const pageQuery = graphql`
  query articleQuery($slug: String!) {
    contentfulBlog(slug: {eq: $slug}) {
      title
      slug
      publishDate(formatString: "dddd, MMM Do YYYY")
      content {
        childMarkdownRemark {
          html
          excerpt
        }
      }
      featureImage {
        file {
          url
        }
      }
      author {
        fullName
        bio {
          childMarkdownRemark {
            html
          }
        }
        avatar {
          title
          file {
            url
          }
        }
      }
    }
  }
`
