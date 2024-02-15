import contentfulConfig from './contentfulConfig'

const contentful = require('contentful-management')

const SPACE_ID = contentfulConfig.space


const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
})

export const uploadImage = async (imgUrl: string) => {
  try {
    const space = await client.getSpace(SPACE_ID)
    const environment = await space.getEnvironment('master')

    // Create a Contentful Asset (image)
    const asset = await environment.createAsset({
      fields: {
        title: {
          'en-US': 'Berlin',
        },
        file: {
          'en-US': {
            contentType: 'image/jpeg',
            fileName: 'berlin_english.jpg',
            upload: imgUrl,
          },
        },
      },
    })

    // Process the upload of the image file
    const uploadedAsset = await asset.processForAllLocales()

    // Publish the asset to make it available
    const publishedAsset = await uploadedAsset.publish()

    console.log('Image uploaded and published:', publishedAsset)
    return publishedAsset
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}
