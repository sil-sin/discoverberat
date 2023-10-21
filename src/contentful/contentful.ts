import { createClient } from 'contentful'
// import contentful from 'contentful-management'
import contentfulConfig from './contentfulConfig'

const client = createClient({
  space: contentfulConfig.space,
  accessToken: contentfulConfig.accessToken,
})

export default client

export async function getContentEntries(entry: string) {
  const response = await client.getEntries({
    content_type: entry,
  })
  console.log(response.items)

  return response.items
}
