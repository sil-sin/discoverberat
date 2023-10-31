// types.d.ts
declare module 'quill' {
  interface DeltaStatic {
    ops: Array<
      {
        insert: string | { image: string }
      }[]
    >
  }

  class Quill {
    // Define Quill methods and properties as needed for your usage
  }
}
