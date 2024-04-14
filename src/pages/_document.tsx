import { Html, Head, Main, NextScript } from 'next/document'
import { ColorSchemeScript } from '@mantine/core'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta
          name='description'
          content='Discover Berat - Guided tours, activities, and excursions.'
        />
        <ColorSchemeScript defaultColorScheme='auto' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
