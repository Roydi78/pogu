import { useState } from 'react'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Ticker from '../components/Ticker'
import Concept from '../components/Concept'
import Flavors from '../components/Flavors'
import Stats from '../components/Stats'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'
import OrderModal from '../components/OrderModal'

export default function Home() {
  const [orderModal, setOrderModal] = useState(null) // null | product | 'general'

  return (
    <>
      <Nav onOrder={() => setOrderModal('general')} />
      <Hero onOrder={() => setOrderModal('general')} />
      <Ticker />
      <Concept />
      <Flavors onOrder={(product) => setOrderModal(product)} />
      <Stats />
      <CTASection onOrder={() => setOrderModal('general')} />
      <Footer />

      {orderModal && (
        <OrderModal
          initialProduct={orderModal === 'general' ? null : orderModal}
          onClose={() => setOrderModal(null)}
        />
      )}
    </>
  )
}
