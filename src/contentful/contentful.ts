import { createClient } from 'contentful'
// import contentful from 'contentful-management'
import contentfulConfig from './contentfulConfig'

const client = createClient({
  space: contentfulConfig.space,
  accessToken: contentfulConfig.accessToken,
})

export default client

export async function getSpecificEntry(entry: string) {
  const response = await client.getEntries({
    content_type: entry,
  })

  return response.items
}
export async function getAllEntries() {
  const response = await client.getEntries()

  return response.items
}
