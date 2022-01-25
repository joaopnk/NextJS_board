import styles from './styles.module.scss';
import { useState } from 'react';


import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession  } from 'next-auth/client';

import { PayPalButtons } from "@paypal/react-paypal-js";
import firebase from '../../services/firebaseConnection';

import Image from 'next/image';
import rocket from '../../../public/images/rocket.svg';

interface DonateProps{
    user:{
        nome: string;
        id: string;
        image: string;  
    } 
}


export default function Donate({user}: DonateProps){

    const [vip, setVip] = useState(false);

    async function handleSaveDonate(){
        // Enviando para o banco
        await firebase.firestore().collection('users')
        .doc(user.id)
        .set({
            donate: true,
            lastDonate: new Date(),
            image: user.image
        })
        .then( () => {
            setVip(true);
        })


    }

    return(
        <>
            <Head>
                <title>Ajude a plataforma board ficar online!</title>
            </Head>
            <main className={styles.container}>
                <Image  src={rocket} alt="Seja apoiador!" />

               
                {/* Se o vip estiver como TRUE(donate = sucesso) aparece a div */}
                {vip && (
                    <div className={styles.vip}>
                        <Image width={50} height={50} src={user.image} alt="Foto de perfil do apoiador/usuario"/>
                        <span>Parabéns, você é um apoiador!</span>
                    </div>
                )}

                <h1>Seja um apoiador deste projeto 🏆</h1>
                <h3>Contribua com apenas <span>R$ 1,00</span></h3>
                <strong>Apareça na nossa home, tenha funcionalidades exclusivas.</strong>
                <PayPalButtons 
                    createOrder= { (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                // Valor:
                                amount:{
                                    value: '1'
                                }
                            }]
                        })
                    }}

                    // Monitorando se o pagamento foi realizado
                    onApprove={ (data, actions ) => {
                        return actions.order.capture().then(function (details){
                            // Capturando nome de quem pagou:
                            console.log(`Compra aprovada: ${details.payer.name.given_name}`);

                            handleSaveDonate();
                        })
                    }}
                />
            </main>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const session = await getSession({req});

    if(!session?.id){
        return{
            redirect:{
                destination: './',
                permanent: false
            }
        }
    }

    const user ={
        nome: session?.user.name,
        id: session?.id,
        image: session?.user.image
    }

    return{
        props: {
            user
        }
    }
}