import { PayPalButtons } from '@paypal/react-paypal-js'
import { FC, useState } from 'react'

type Props = {
  onSubmit: (data: any) => void
  products: {
    title: string
    price: number
    currency: string
    id: string
    uid: string
    guestNumber: number
    type: string
    isPaid: boolean
  }
}
const PaypalCheckoutButton: FC<Props> = ({ products, onSubmit }) => {
  const [paidFor, setPaidFor] = useState(false)

  const handleApprove = (orderId: any) => {
    setPaidFor(true)
    onSubmit({ orderId, ...products, isPaid: true })
  }

  if (paidFor) {
    return <p>Payment valid</p>
  }

  return (
    <div>
      <PayPalButtons
        style={{
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          height: 50,
          tagline: false,
        }}
        fundingSource='paypal'
        onClick={(data, actions) => {
          actions.resolve()
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                reference_id: products.uid,
                description: products.title,
                amount: {
                  value: `${products.price * products.guestNumber}`,
                },
              },
            ],
          })
        }}
        onApprove={async (data, actions) => {
          const order: any = await actions?.order?.capture()
          console.log('Capture result', order)
          handleApprove(data.orderID)
        }}
        onCancel={() => {
          console.log('Transaction cancelled')
        }}
        onError={(err) => console.error('PayPal Error:', err)}
      />
      <PayPalButtons
        onClick={(data, actions) => {
          //Validate button click
        }}
        fundingSource='card'
        createOrder={(data, actions) => {
          console.log({ data, actions })
          return actions.order.create({
            purchase_units: [
              {
                description: products.title,
                amount: {
                  currency_code: 'EUR',
                  value: `${products.price * products.guestNumber}`,
                },
              },
            ],
          })
        }}
        onApprove={async (data, actions) => {
          const order: any = await actions?.order?.capture()
          console.log('Capture result', order)
          handleApprove(data.orderID)
        }}
        onCancel={() => {
          console.log('Transaction cancelled')
        }}
        onError={(err) => console.error('PayPal Error:', err)}
      />
    </div>
  )
}
export default PaypalCheckoutButton
