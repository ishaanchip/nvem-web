import React, {useState, useEffect} from 'react'
import "./Header.css"


//images & icons


//intercomponent imports


//external dependenices
import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton, useUser as clerkUseUser, useClerk } from "@clerk/clerk-react";


const Header = () => {
  //1. clerk sign up / sign out func
    //sign out assuring clearing of local storage  
    const {signOut} = useClerk()  
    const handleSignOut = async () =>{
      await signOut()
      localStorage.clear()
    }


  return (
    <div className='header-area'>
        <div className="logo-area">
          <h1>NVEM</h1>
        </div>

        <div className="nav-area">
            <p>Courses</p>
            <p>FAQs</p>
            <p>About Us</p>
        </div>

        <div className="account-area">
                <SignedOut>
                    <SignUpButton mode="modal" className='log-in'></SignUpButton>
                    <SignInButton mode="modal" className='sign-up'></SignInButton>
                </SignedOut>
                <SignedIn>
                    <button mode="modal" className='sign-up' onClick={handleSignOut}>Sign out</button>
                </SignedIn>
        </div>
    

    </div>
  )
}

export default Header