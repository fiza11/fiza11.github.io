/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

 module.exports = {
   siteMetadata: {
     title: 'Fiza Husain',
     author: 'Fiza Husain',
     description: 'Personal Website',
   },
   plugins: [
     'gatsby-plugin-react-helmet',
     {
       resolve: `gatsby-plugin-manifest`,
       options: {
         name: 'gatsby-starter-default',
         short_name: 'starter',
         start_url: '/',
         background_color: '#663399',
         theme_color: '#663399',
         display: 'minimal-ui',
       },
     },
     'gatsby-plugin-sass',
   ],
 }
