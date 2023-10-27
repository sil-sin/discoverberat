import { createClient } from 'contentful'
const contentful = require('contentful-management')
import contentfulConfig from './contentfulConfig'

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

export async function createContent(input: string) {
  console.log(input)

  const clientEdit = contentful.createClient({
    accessToken: 'CFPAT-Juzn-HgMDO36houFXIhe3rHi2cmekD3SzU-9y2UO99E',
    space: contentfulConfig.space,
  })

  clientEdit
    .getSpace(contentfulConfig.space)
    .then((space: any) => space.getEnvironment('master'))
    .then((environment: any) => {
      console.log('environment')

      return environment.createEntryWithId('tourPage', `${Math.random()}`, {
        fields: {
          title: {
            'en-US': input,
          },

          url: { 'en-US': input.toLowerCase().split(' ').join('-') },
        },
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
