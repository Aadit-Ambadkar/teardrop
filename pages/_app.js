import Nav from '../components/NavBar'
import '../styles/globals.css'
import { SessionProvider } from "next-auth/react";
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
    return (
        <SessionProvider session={pageProps.session}>
            <div className='bg-teal-50'>
                <Nav />
                <Component {...pageProps} />
            </div>
        </SessionProvider>
    )
}

export default MyApp
