import { createClient } from 'contentful'
import contentfulConfig from './contentfulConfig'

const client = createClient({
  space: contentfulConfig.space,
  accessToken: contentfulConfig.accessToken,
})

export default client

export async function getEntriesByType(
  entry: string,
  query: Record<string, unknown> = {},
) {
  const response = await client.getEntries({
    content_type: entry,
    ...query,
  })

  return response.items
}
export async function getEntry(entryId: string, query?: {}) {
  const response = query
    ? await client.getEntry(entryId, query)
    : await client.getEntry(entryId)
  return response
}
