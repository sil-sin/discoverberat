import { createClient } from 'contentful'
const contentful = require('contentful-management')
import contentfulConfig from './contentfulConfig'

const client = createClient({
  space: contentfulConfig.space,  
  accessToken: contentfulConfig.accessToken,
})

const clientEdit = contentful.createClient({
  accessToken: 'CFPAT-Juzn-HgMDO36houFXIhe3rHi2cmekD3SzU-9y2UO99E',
  space: contentfulConfig.space,
})

export default client

export async function getEntriesByType(entry: string) {
  const response = await client.getEntries({
    content_type: entry,
  })

  return response.items
}
export async function getEntry(entryId: string) {
  const response = await client.getEntry(entryId)
  return response
}
export async function createContent(entryType: string, fields: any) {
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

export const editEntry = async (entryId: string, fields: any) => {
  clientEdit
    .getSpace(contentfulConfig.space)
    .then((space: any) => space.getEnvironment('master'))
    .then((environment: any) => environment.getEntry(entryId))
    .then((entry: { update: () => any; fields: any }) => {
      console.log('Entry:', entry)
      entry.fields = fields
      return entry.update()
    })
    .then((publishedEntry: any) => {
      console.log('Published Entry:', publishedEntry)
    })
    .catch(console.error)
}

// export async function publishEntry(entryId: any) {
//   try {
//     const space = await clientEdit.getSpace(contentfulConfig.space)
//     const environment = await space.getEnvironment('master')
//     const entry = await environment.getEntry(entryId)

//     await entry.publish()
//     console.log(`Entry ${entryId} published successfully.`)
//   } catch (error) {
//     console.error('Error publishing entry:', error)
//   }
// }
