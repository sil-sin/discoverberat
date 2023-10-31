import { createClient } from 'contentful'
const contentful = require('contentful-management')
import contentfulConfig from './contentfulConfig'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

const client = createClient({
  space: contentfulConfig.space,
  accessToken: contentfulConfig.accessToken,
})

export default client

export async function getEntry(entry: string) {
  const response = await client.getEntries({
    content_type: entry,
  })

  return response.items
}

export async function createContent(entryType: string, fields: any) {
  const clientEdit = contentful.createClient({
    accessToken: 'CFPAT-Juzn-HgMDO36houFXIhe3rHi2cmekD3SzU-9y2UO99E',
    space: contentfulConfig.space,
  })

  clientEdit
    .getSpace(contentfulConfig.space)
    .then((space: any) => space.getEnvironment('master'))
    .then((environment: any) => {
      return environment.createEntry(entryType, {
        fields,
      })
    })
    .then((entry: { update: () => any }) => {
      // Save the entry with its content
      return entry.update()
    })
    .then((entry: { publish: () => any }) => {
      // Publish the entry to make it available in the Published state
      return entry.publish()
    })
    .then((publishedEntry: any) => {
      console.log('Published Entry:', publishedEntry)
    })
    .catch(console.error)
}
