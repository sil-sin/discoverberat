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

  return response.items
})
export const getEntry = cache((entryId: string) => client.getEntry(entryId))
