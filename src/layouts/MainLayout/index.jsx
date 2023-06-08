import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { routers } from '@/routers'
import React, { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation, useRoutes } from 'react-router-dom'

export const MainLayout = () => {
  // const location = useLocation();

  // const [displayLocation, setDisplayLocation] = useState(location);
  // const [transitionStage, setTransistionStage] = useState("pageFadeIn");

  // useEffect(() => {
  //   if (location !== displayLocation) setTransistionStage("pageFadeOut");
  // }, [location, displayLocation]);


  // const element = useRoutes(routers, displayLocation)

  return (
    <>
      <Header />
      {/* <div
        className={`${transitionStage}`}
        onAnimationEnd={() => {
          if (transitionStage === "pageFadeOut") {
            setTransistionStage("pageFadeIn");
            setDisplayLocation(location);
          }
        }}
      > */}
        <Suspense fallback={<div>MainLayout Loading...</div>}>
          {/* {element}\ */}
          <Outlet />
        </Suspense>
      {/* </div> */}
      <Footer />
    </>
  )
}
