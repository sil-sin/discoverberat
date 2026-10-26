import { createClient } from 'contentful'
import { cache } from 'react'
import contentfulConfig from './contentfulConfig'

const client = createClient({
  space: contentfulConfig.space,
  accessToken: contentfulConfig.accessToken,
})

export default client

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
export const getEntry = cache(async (entryId: string, query?: {}) => {
  const response = query
    ? await client.getEntry(entryId, query)
    : await client.getEntry(entryId)
  return response
})
