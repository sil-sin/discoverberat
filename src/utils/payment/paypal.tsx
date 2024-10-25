// import { PayPalButtons } from '@paypal/react-paypal-js'
// import { useRouter } from 'next/router'
// import { FC, useState } from 'react'
//
// type Props = {
//   onSubmit: (data: any) => void
//   products: {
//     title: string
//     price: number
//     currency: string
//     id: string
//     uid: string
//     guestNumber: number
//     type: string
//     isPaid: boolean
//   }
// }
//
// const PaypalCheckoutButton: FC<Props> = ({ products, onSubmit }) => {
//   const [paidFor, setPaidFor] = useState(false)
//   const router = useRouter()
//
//   const handleApprove = (orderId: any) => {
//     setPaidFor(true)
//     onSubmit({ orderId, ...products, isPaid: true })
//     // const queryString = stringify({ orderId, ...products, isPaid: true })
//     // router.push('/thank-you?' + queryString)
//   }
//
//   if (paidFor) {
//     return <p>Payment valid</p>
//   }
//
//   return (
//     <div>
//       <PayPalButtons
//         style={{
//           shape: 'rect',
//           color: 'gold',
//           layout: 'vertical',
//           height: 50,
//           tagline: false,
//         }}
//         fundingSource='paypal'
//         onClick={(data, actions) => {
//           actions.resolve()
//         }}
//         createOrder={(data, actions) => {
//           return actions.order.create({
//             purchase_units: [
//               {
//                 reference_id: products.uid,
//                 description: products.title,
//                 amount: {
//                   currency_code: products.currency, // Include currency_code
//                   value: (products.price * products.guestNumber).toFixed(2),
//                 },
//               },
//             ],
//           })
//         }}
//         onApprove={async (data, actions) => {
//           const order: any = await actions?.order?.capture()
//           handleApprove(data.orderID)
//         }}
//         onCancel={() => {
//           console.info('Transaction cancelled')
//         }}
//         onError={(err) => console.error('PayPal Error:', err)}
//       />
//
//       <PayPalButtons
//         fundingSource='card'
//         createOrder={(data, actions) => {
//           // @ts-ignore
//           return actions.order.create({
//             intent: undefined,
//             purchase_units: [
//               {
//                 description: products.title,
//                 amount: {
//                   currency_code: products.currency, // Include currency_code
//                   value: (products.price * products.guestNumber).toFixed(2),
//                 },
//               },
//             ]
//           })
//         }}
//         onApprove={async (data, actions) => {
//           const order: any = await actions?.order?.capture()
//           handleApprove(data.orderID)
//         }}
//         onCancel={() => {
//           console.info('Transaction cancelled')
//         }}
//         onError={(err) => console.error('PayPal Error:', err)}
//       />
//     </div>
//   )
// }
//
// export default PaypalCheckoutButton
