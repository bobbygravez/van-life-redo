import React, { useEffect } from 'react'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from 'react-router-dom'

import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Vans, { loader as vansLoader } from './pages/vans/AllVans'
import VansDetail, { loader as VansDetailLoader } from './pages/vans/VansDetail'
import Error from './components/Error'
import Login, { action as loginAction } from './pages/login'
import CreateUser, { action as CreateUserAction } from './pages/CreateUser'
import ForgotPassword, { action as forgotPasswordAction } from './pages/ForgotPassword'
import NotFound from './components/NotFound'
import HostLayout from './components/HostLayout'
import AuthRequired from './components/AuthRequired'
import Dashboard, { loader as dashboardLoader } from './pages/host/Dashboard'
import EditVan, { loader as editVanLoader } from './pages/host/EditVan'
import HostVans, { loader as HostVansLoader } from './pages/host/HostVans'
import Reviews, {loader as reviewsLoader} from './pages/host/Reviews'
import Income from './pages/host/Income'
import AddVan from './pages/host/AddVan'
import HostVanDetail, { loader as HostVanDetailLoader } from './pages/host/HostVanDetail'
import Details from './pages/host/Details'
import Pricing from './pages/host/Pricing'
import Photos from './pages/host/Photos'



const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Layout />} errorElement={<Error />}>
    <Route index element={<Home />} />
    <Route path='about' element={<About />} />
    <Route path='login' element={<Login />} action={loginAction} errorElement={<Error />} />
    <Route path='createUser' element={<CreateUser />} action={CreateUserAction} errorElement={<Error />} />
    <Route path='forgotPassword' element={<ForgotPassword />} errorElement={<Error />} action={forgotPasswordAction} />
    <Route path='vans' element={<Vans />} loader={vansLoader} errorElement={<Error />} />
    <Route path='vans/:id'
      element={<VansDetail />}
      loader={VansDetailLoader}
      errorElement={<Error />}
    />
    <Route element={<AuthRequired />} >
      <Route path='host' element={<HostLayout />}>
        <Route index element={<Dashboard />} errorElement={<Error />} loader={dashboardLoader} />
        <Route path='edit/:id' element={<EditVan />} errorElement={<Error />} loader={editVanLoader} />
        <Route path='income' element={<Income />} />
        <Route path='vans' element={<HostVans />} loader={HostVansLoader} errorElement={<Error />} />
        <Route path='reviews' element={<Reviews />} errorElement={<Error />} loader={reviewsLoader}/>
        <Route path='vans/:id' element={<HostVanDetail />} loader={HostVanDetailLoader}>
          <Route index element={<Details />} />
          <Route path='pricing' element={<Pricing />} />
          <Route path='photos' element={<Photos />} />
        </Route>
        <Route path='addVan' element={<AddVan />} errorElement={<Error />} />
      </Route>
    </Route>
    <Route path='*' element={<NotFound />} />
  </Route>
))


function App() {
    return (
      <RouterProvider router={router} />
    )
}

export default React.memo(App)


