"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <main>
        <div 
          className="w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/banner.png')" }}
        >
          <div 
            className="flex flex-col items-start gap-4 pt-2 pb-8"
            style={{
              background: "linear-gradient(to right, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0) 100%)"
            }}
          >
            <h1 className="text-8xl sm:text-[6rem] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] font-bold px-8 py-4 rounded-lg"> 
              ReunItems 
            </h1>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ml-2 font-bold text-blue-700">
              Find your lost items on your local campus.
            </h1>

            <p className="ml-5 text-2xl mb-4">
              Lost something important? Found an item that belongs to someone else? You're in the right place.
            </p>
            
            <div className="flex space-x-4 ml-5 mr-5 items-center w-full">
              <Button 
                variant="primary" 
                href="/schoolfind"
                color1="#0e004c"
                color2="#1e40af"
              >
                Find Your Organization
              </Button>
              

              <Link href="/login" className="bg-[#8B9AF0] hover:bg-blue-500 text-white font-bold rounded-full px-8 py-3 transition">
                Sign Up For Your School'S Lost&Found
              </Link>

              
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 ml-5 mr-5 mt-8">
          <div className="lg:w-[55%] w-full bg-brand-blue">
            <h3 className="font-bold text-3xl mt-4">Lost something important? Found an item that belongs to someone else? You're in the right place.</h3>
            <p className="text-3xl mt-4">Our smart lost and found platform makes it easier than ever to recover lost belongings and return found items to their rightful owners. Whether you dropped your keys on campus, left your laptop in a coffee shop, or found someone's wallet – we're here to help reconnect people with their possessions.</p>
          </div>
          <div className="lg:w-[45%] w-full">
            <div className="w-full h-[300px] lg:h-[400px] overflow-hidden">
              <Image 
                src="/assets/lostandfound.png"
                alt="Lost and Found Illustration"
                width={800} 
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 ml-5 mr-5 mt-8">
          <div className="lg:w-[45%] w-full">
            <div className="w-full h-[300px] lg:h-[400px] overflow-hidden">
              <Image 
                src="/assets/findschool.png"
                alt="Lost and Found Illustration" 
                width={800} 
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:w-[55%] w-full bg-brand-sky">
            <h3 className="font-bold text-3xl mt-4">How It Works:</h3>
            <p className="text-2xl mt-4">Lost Something?: Search our database of found items, submit a detailed claim with photos for proof of ownership, and get notified when there's a match. Our smart search even recognizes common misspellings, so you won't miss your item because of a typo.</p>
            <p className="text-2xl mt-4">Found Something?: Quickly report found items with photos and descriptions. Good Samaritans like you help make our community a better place – we'll handle connecting items with their owners.</p>
            <p className="text-2xl mt-4">
              Why Choose Us?
              Smart Search Technology | Map Features | Photo Verification | Admin-Verified Process | Multi-Platform Access | Simple UI
            </p>
          </div>
        </div>
          <h1 className="text-5xl text-bold mt-8 ml-5 mr-5 mb-8 text-center">Don't let lost items stay lost. Start your search or report a found item today!</h1>
        <p></p>
      </main>
    </div>
  );
}