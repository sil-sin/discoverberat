// types.d.ts
declare module 'quill' {
  interface DeltaStatic {
    ops: Array<
      {
        insert: string | { image: string }
      }[]
    >
  }
}
