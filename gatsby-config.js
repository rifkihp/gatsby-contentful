require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: "Rifki Heruprasetyo's website",
    description: 'Rifki Heruprasetyo, doing javascript and stuff...',
    siteUrl: 'https://rifkihp.com',
  },
  plugins: [
    {
      resolve: 'gatsby-source-contentful',
      options: {
        spaceId: process.env.RIFKI_HP_CF_SPACE,
        accessToken: process.env.RIFKI_HP_CF_TOKEN,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: ['gatsby-remark-autolink-headers', 'gatsby-remark-prismjs'],
      },
    },
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://rifkihp.com',
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
        feeds: [
          {
            serialize: ({query: {site, allContentfulBlog}}) => {
              return allContentfulBlog.edges.map((edge) => {
                return Object.assign({}, edge.node, {
                  title: edge.node.title,
                  description: edge.node.content.childMarkdownRemark.excerpt,
                  url:
                    site.siteMetadata.siteUrl + '/articles/' + edge.node.slug,
                  guid:
                    site.siteMetadata.siteUrl + '/articles/' + edge.node.slug,
                  custom_elements: [
                    {
                      'content:encoded':
                        edge.node.content.childMarkdownRemark.html,
                    },
                    {'dc:creator': 'Rifki Heruprasetyo'},
                  ],
                })
              })
            },
            query: `
            {
              allContentfulBlog(
                limit: 1000,
                sort: { order: DESC, fields: [publishDate] },
              ) {
                edges {
                  node {
                    content {
                      childMarkdownRemark {
                        excerpt
                        html
                      }
                    }
                    slug 
                    title
                    date: publishDate
                  }
                }
              }
            }
          `,
            output: '/rss.xml',
            title: "Rifki Heruprasetyo's blog feed",
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Rifki Heruprasetyo',
        short_name: 'RH',
        start_url: '/',
        background_color: '#ffffff',
        icons: [
          {
            src: '/favicons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        theme_color: '#ffffff',
        display: 'standalone',
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: '258049661',
        head: false,
        anonymize: true,
        siteSpeedSampleRate: 10,
      },
    },
    'gatsby-plugin-postcss',
  ],
}
