import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import LivePurchaseToast from './components/LivePurchaseToast'
import { PageLoader } from './components/Loading'
import SEO from './components/SEO'
import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Collection = lazy(() => import('./pages/Collection'))
const Contact = lazy(() => import('./pages/Contact'))
const Product = lazy(() => import('./pages/Product'))
const Cart = lazy(() => import('./pages/Cart'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Order = lazy(() => import('./pages/Order'))
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'))
const Profile = lazy(() => import('./pages/Profile'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))

const AppContent = () => {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      <SEO />
      <ToastContainer
        position='top-center'
        autoClose={2800}
        hideProgressBar
        closeOnClick
        pauseOnHover
        theme='colored'
        transition={Slide}
        limit={3}
        toastClassName='!rounded-2xl !shadow-premium'
      />
      {!isAdmin && <LivePurchaseToast />}
      <NavBar />
      <main className='flex-1 px-3 sm:px-4 md:px-[5vw] lg:px-[7vw] xl:px-[9vw] py-4 sm:py-6'>
        <PageTransition>
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/collection' element={<Collection />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/product/:id' element={<Product />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/order' element={<Order />} />
              <Route path='/place-order' element={<PlaceOrder />} />
              <Route path='/wishlist' element={<Wishlist />} />
              <Route path='/admin' element={<AdminDashboard />} />
              <Route path='/admin/products' element={<AdminProducts />} />
              <Route path='/admin/orders' element={<AdminOrders />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </main>
      <Footer />
    </>
  )
}

const App = () => (
  <div className='flex flex-col min-h-screen bg-neutral-50/20 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 antialiased transition-colors duration-300'>
    <AppContent />
  </div>
)

export default App
