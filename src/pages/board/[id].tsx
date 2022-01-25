import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import firebase from "../../services/firebaseConnection";
import { format } from 'date-fns';

import Head from "next/head";
// # CSS
import styles from './task.module.scss';
// # Icons
import { FiCalendar } from 'react-icons/fi'


type Task = {
    id: string;
    created: string | Date;
    createdFormat?: string;
    tarefa: string;
    userId: string;
    nome: string;
}

interface TaskListProps{
    data: string;
}

export default function Task({ data }: TaskListProps){
    const task = JSON.parse(data) as Task; //Forçando a tipagem


    return (
        <>
            <Head>
                <title>Detalhes da sua tarefa</title>
            </Head>
            <article className={styles.container}>
                <div className={styles.actions}>
                    <div>
                        <FiCalendar  size={30} color="#fff" />
                        <span>Tarefa criada:</span>
                        <time>{task.createdFormat}</time>
                    </div>
                </div>
                <p>
                    {task.tarefa}
                </p>
            </article>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {

    const { id } = params; 

    const session = await getSession({req});


    // Verificando se é vip, se não tiver o VIP = TRUE, volta pro board principal
    if(!session?.vip){
        return{
            redirect:{
                destination: '/board',
                permanent: false
            }
        }
    }

    const data = await firebase.firestore().collection('tarefas')
    .doc(String(id))
    .get()
    .then((snapshot) => {
        const data = {
            id: snapshot.id,
            created: snapshot.data().created,
            createdFormat: format(snapshot.data().created.toDate(), 'dd MMMM yyyy'),
            tarefa: snapshot.data().tarefa,
            userId: snapshot.data().userId,
            nome: snapshot.data().nome
        }

        // Convertendo p/ JSON
        return JSON.stringify(data);

    })
    .catch( () => {
        return {};
    })

    // Verificando se um objeto esta vazio (validação para não acessar um link de tarefa que não existe)
    if(Object.keys(data).length === 0){
        return{
            redirect:{
                destination: '/board',
                permanent: false
            }
        }
    }

    // Pegando req.
    return{
        props:{
            data
        }
    }
}