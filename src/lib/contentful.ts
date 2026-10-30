import { createClient } from 'contentful'
import { cache } from 'react'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN ?? '',
})

export const getEntriesByType = cache(async (
  entry: string,
  query: Record<string, unknown> = {},
) => {
  const response = await client.getEntries({
    content_type: entry,
    ...query,
  })
  if (entry === 'tourPage') {
    await Promise.all(
      response.items.map(async (item: any) => {
        const file = item.fields?.image?.fields?.file
        if (file?.url) file.blurDataURL = await getBlurDataURL(file.url)
      }),
    )
  }

  return response.items
})

// Contentful asset URLs change with each upload, so the thumbnail can be cached forever.
const getBlurDataURL = (url: string) =>
  fetch(`${url.startsWith('//') ? 'https:' : ''}${url}?w=16&q=50&fm=jpg`, {
    cache: 'force-cache',
    signal: AbortSignal.timeout(3000),
  })
    .then(async (res) =>
      res.ok
        ? `data:image/jpeg;base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`
        : undefined,
    )
    .catch(() => undefined)
export const getEntry = cache((entryId: string) => client.getEntry(entryId))
