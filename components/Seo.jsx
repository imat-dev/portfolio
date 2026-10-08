import React from 'react'
import Head from 'next/head'
import { generateNextSeo } from 'next-seo/pages'
import { siteMetaData } from '../theme.config'

const Seo = (props) => {
  const { seo = {}, title, description, images, pageUrl } = props

  const metaData = {
    ...siteMetaData,
    title,
    description,
    ...seo,
  }

  const ogImageUrl = images?.[0]?.src ? metaData.siteUrl + images[0].src : undefined

  const openGraph = {
    url: pageUrl,
    title: metaData.title,
    description: metaData.description,
    images: [{ url: ogImageUrl }],
    site_name: metaData.siteName,
    locale: metaData.locale,
  }

  return <Head>{generateNextSeo({ ...metaData, openGraph })}</Head>
}

export default Seo
