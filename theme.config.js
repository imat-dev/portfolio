/** *************************************************************
 * Please refer to the Theme Options section in documentation   *
 ****************************************************************/

/**
 * Icons from react-icons: https://react-icons.github.io/react-icons
 */

import { IoLogoTwitter, IoLogoGithub, IoLogoLinkedin } from 'react-icons/io5'
import { TfiHome, TfiPencilAlt } from 'react-icons/tfi'
import { SlUser, SlBriefcase, SlEnvolope, SlTrophy } from 'react-icons/sl'

/**
 * Main Menu Items
 */

export const menu = [
  {
    name: 'Home',
    slug: '/',
    Icon: TfiHome,
    // number: 1,
  },
  {
    name: 'About',
    slug: '/about',
    Icon: SlUser,
  },
  // {
  //   name: 'Services',
  //   slug: '/services',
  //   Icon: SlBriefcase,
  // },
  // {
  //   name: 'Articles',
  //   slug: '/blog',
  //   Icon: TfiPencilAlt,
  // },
  {
    name: 'Projects',
    slug: '/projects',
    Icon: SlTrophy,
  },
  {
    name: 'Contact',
    slug: '/contact',
    Icon: SlEnvolope,
  },
]

/**
 * Social Links under the Main Menu
 */

export const social = [
  {
    name: 'Twitter',
    url: 'https://www.twitter.com/',
    Icon: IoLogoTwitter,
  },
  {
    name: 'Github',
    url: 'https://github.com/imat-dev',
    Icon: IoLogoGithub,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/raymart-marasigan-079081267/',
    Icon: IoLogoLinkedin,
  },
]

/**
 * General configurations
 */

export const config = {
  dateLocale: 'en-US',
  dateOptions: {
    // dateOptions is passed to JavaScript's toLocaleDateString()
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  },
  convertKit: {
    tipUrl: 'https://fantastic-mover-3439.ck.page/products/blog',
  },
  contactForm: {
    inputs: require('./content/contact-form.json'),
    recipient: 'raymart.marasigan@gmail.com',
    sender: 'me@imat.dev',
    subject: 'EMAIL NOTIFICATION SUBJECT',
  },
}

/**
 * MDX/Markdown configurations
 */

export const mdxConfig = {
  publicDir: 'public',
  pagesDir: 'content',
  fileExt: '.md',
  // collections: ['/blog', '/projects'],
  collections: ['/projects'],
  remarkPlugins: [],
  rehypePlugins: [],
}

/**
 * Global SEO configuration for next-seo plugin
 * https://github.com/garmeeh/next-seo
 */

export const siteMetaData = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'http://localhost:3000',
  authorName: 'Imat Marasigan',
  siteName: 'Imat Marasigan - Portfolio',
  defaultTitle: 'Imat Marasigan - Portfolio',
  titleTemplate: 'Imat Marasigan | %s',
  description: 'My portfolio website.',
  email: 'raymart.marasigan@gmail.com',
  locale: 'en_US',
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
}
