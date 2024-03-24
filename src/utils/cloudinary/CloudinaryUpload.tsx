// import { useEffect } from 'react'
// import styles from './upload.module.css'

// export default function Upload({
//   getImgUrl,
// }: {
//   getImgUrl: (imageUrl: string) => void
// }) {
//   const cloudName = 'dmijs46j0' // Replace with your Cloudinary cloud name
//   const unsignedUploadPreset = 'ml_default' // Replace with your upload preset

//   const openUploadWidget = () => {
//     if (typeof window !== 'undefined') {
//       // Check if the window object is available (not during server-side rendering)
//       const widget = (window as any).cloudinary.createUploadWidget(
//         {
//           cloudName: cloudName,
//           uploadPreset: unsignedUploadPreset,
//         },
//         (error: any, result: { event: string; info: { secure_url: any } }) => {
//           if (!error && result && result.event === 'success') {
//             const imageUrl = result.info.secure_url
//             getImgUrl(imageUrl)
//           } else if (error) {
//             console.error('Error uploading image:', error)
//           // }
//         }
//       )

//       widget.open() // Open the upload widget when called
//     }
//   }

//   useEffect(() => {
//     // Load the Cloudinary library dynamically
//     const script = document.createElement('script')
//     script.src = 'https://widget.cloudinary.com/v2.0/global/all.js'
//     script.async = true

//     document.body.appendChild(script)

//     return () => {
//       // Clean up the script element if the component unmounts
//       document.body.removeChild(script)
//     }
//   }, [])

//   return (
//     <div>
//       <button
//         className={styles.uploadButton}
//         type='button'
//         onClick={openUploadWidget}
//       >
//         Upload Image
//       </button>
//     </div>
//   )
// }
