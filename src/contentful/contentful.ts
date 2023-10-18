import { createClient } from 'contentful'
// import contentful from 'contentful-management'
import contentfulConfig from './contentfulConfig'

const client = createClient({
  space: contentfulConfig.space,
  accessToken: contentfulConfig.accessToken,
})

export default client

export async function getAllEntries() {
  const response = await client.getEntries()

  return response.items
}
