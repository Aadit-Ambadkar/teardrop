import Nav from '../components/NavBar'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Nav names={[]} links={[]}/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
