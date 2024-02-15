export type Tour = {
  fields: {
    title: string
    description: any
    price: number
    currency: string
    image?: any
    url: string
  }
}

export type CustomError = {
  code?: number | string
  message?: string
}
