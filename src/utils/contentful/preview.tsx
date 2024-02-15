import contentfulConfig from "./contentfulConfig"

export default function generatePreviewURL(entryId: any) {
  // Replace with your Contentful settings
  const spaceId = contentfulConfig.space
  const previewToken = 'uNCmGWOhXDdxpba6NP4DpODR93KyK9mMbwI9ErpsA68'

  // Construct the base URL for the Contentful Preview API
  const baseUrl = `https://preview.contentful.com/spaces/${spaceId}`

  // Define the content type ID you want to preview
  const entryIdUrlParams = `content_type=${entryId}`

  // Combine all components to create the preview URL
  const previewURL = `${baseUrl}/entries?${entryIdUrlParams}&access_token=${previewToken}`

  return previewURL
}
