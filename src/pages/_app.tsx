import { Provider as NextAuthProvider } from 'next-auth/client'


//# Tipando o Component 
import { AppProps } from 'next/app';

//# Importando CSS global (Padrão)
import '../styles/global.scss';

//# Importando componentes
import { Header } from '../components/Header';

//#API DO PAYPAL  
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

// client-id: o que vincula quem vai receber o pagamento (EDITAR CASO MUDE DE CONTA)
const initialOptions = {
  "client-id": "AR88xMYu-29MP6GFDQGIZvIKvqvFrDbpRaOZfqxL2YqIBuk0ld5j6HlcocAhoSPEolYdgonuYsJ6YFS-",
   currency: "BRL",
   intent: 'capture'
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <PayPalScriptProvider options={initialOptions}> 
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </ NextAuthProvider>
  )
}

export default MyApp
