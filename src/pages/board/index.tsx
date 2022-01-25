import { useState, FormEvent } from 'react';
import Link from 'next/link';
// #CSS:
import styles from './styles.module.scss';
// #Para verificação do lado do servidor
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
// #Icones:
import {FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX} from 'react-icons/fi';
// #Componentes:
import { SupportButton } from '../../components/SuportButton';
import Head from 'next/head';
import { format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
// #Firebase
import firebase from '../../services/firebaseConnection';

//Client ID: ATlLE34yVaUaV7jtRLvplsQMBae0_MifFt9niSsAXXQ0IM6D7bd0dnvKR3tBWUrcoaHKBM9Zx3jiFmVE
//<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>


type TaskList = {
    id: string;
    created: string | Date;
    createdFormat?: string;
    tarefa: string;
    userId: string;
    nome: string;
}


// #Tipando dados (para deixar mais clean)
interface BoardProps{
    user: {
        id: string;
        nome: string;
        vip: boolean;
        lastDonate: string | Date;
    }
    data: string
}

export default function Board({user, data}: BoardProps ){

    const [input, setInput] = useState('');

    const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));

    const [taskEdit, setTaskEdit] = useState<TaskList | null>(null);

    // # Função de adicionar tarefa
    async function handleAddTask(e: FormEvent){
        e.preventDefault(); //Para não atualizar a pagina

        // # Validação se usuario digitou algo
        if(input === ''){
            alert('Escreva alguma tarefa!');
            return;
        }

        // Verificando se esta editando uma tarefa
        if(taskEdit){
            await firebase.firestore().collection('tarefas')
            .doc(taskEdit.id)
            .update({
                tarefa: input
            })
            .then( () => {
                //Procurando a posição da tarefa que editou
                let data = taskList;
                let taskIndex = taskList.findIndex(item => item.id === taskEdit.id);
                data[taskIndex].tarefa = input

                //Atualizando informação 
                setTaskList(data);
                setTaskEdit(null);
                setInput('');
                
            })

            
            return;
        }

        await firebase.firestore().collection('tarefas')
        .add({
            created: new Date(), //Data
            tarefa: input, //o que digitou
            userId: user.id, //id
            nome: user.nome //nome 
        })
        .then((doc) => {
            console.log("CADASTRADO COM SUCESSO!")
            let data = {
                id: doc.id,
                created: new Date(),
                createdFormat: format(new Date(), 'dd MMMM yyyy'),
                tarefa: input,
                userId: user.id,
                nome: user.nome
            };

            setTaskList([...taskList, data]);
            setInput('');
        })

        .catch((err) => {
            console.log(`ERRO AO CADASTRAR ${err}`);
        })

    }

    // Função que vai deletar tarefa
    async function handleDelete (id: string){

        //Acessando a terefa: doc(id)
        await firebase.firestore().collection('tarefas').doc(id)
        .delete()
        .then( () => {
            console.log(`Tarefa deletada: ${id}`);
            // Atualizando (Retornando todos os itens com id DIFERENTE do que eu estou deletando)
            let taskDeleted = taskList.filter( item => {
                return (
                    item.id  !== id
                )
            })

            // Atualizando
            setTaskList(taskDeleted);
        })
        .catch((err) => {
            console.log(`#Houve um erro ao deletar a tarefa de id: ${id} \n\n ${err}`)
        })
    }
    
    function handleEditTask(task: TaskList) {
        setTaskEdit(task);
        setInput(task.tarefa);
    }

    function handleCancelEdit(){
        setInput('');
        setTaskEdit(null);

    }

    return (
        <>
        <Head>
            <title>Minhas tarefas - Board</title>
        </Head>
            <main className={styles.container}>

                {/* Se o task Edit não estiver NULL, avisando o user. que estará editando uma tarefa  */}
                {taskEdit && (
                    <span className={styles.warnText}>
                        <button onClick={ () => handleCancelEdit()}>
                            <FiX size={30} color ="#FF3636" />
                        </button>
                        Você está editando uma tarefa 
                    </span>
                )}


                <form onSubmit={handleAddTask}>
                    <input
                    type="text"
                    placeholder="Digite sua tarefa..."
                    value={input}
                    onChange={ (e) => setInput(e.target.value)}
                    />
                    <button
                    type="submit">
                        <FiPlus size={25} color="#17181f" />
                    </button>
                </form>
                <h1>Você tem {taskList.length} {taskList.length === 1 ? 'Tarefa' : 'Tarefas'}!</h1>
                
                <section>
                    {/* Trazendo as tasks! */}
                    {taskList.map( task => (
                        <article key={task.id} className={styles.taskList}>
                            <Link href={`/board/${task.id}`}>
                                <p>{task.tarefa}</p>
                            </Link>
                            <div className={styles.actions}>
                                <div>
                                    <div>
                                        <FiCalendar  size={20} color="#FFB800" />
                                        <time>{task.createdFormat}</time>
                                    </div>
                                    {/* CASO SEJA VIP: RENDERIZE O BOTÃO */}
                                    {user.vip && (
                                    <button onClick={ () => handleEditTask(task) }>
                                        <FiEdit2 size={20} color="#FFF"  />
                                        <span>Editar</span>
                                    </button>
                                    )}
                                </div>

                                <button onClick={ () => handleDelete(task.id) }>
                                    <FiTrash size={20} color="#ff3636" />
                                    <span>Excluir</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </section>

            </main>
            {/* CASO SEJA VIP: MOSTRE A ULTIMA DOAÇÃO */}
            { user.vip && (
            <div className={styles.vipContainer}>
                <h3>Obrigado por apoiar esse projeto.</h3>
                <div>
                    <FiClock size={28} color="#fff" />
                    <time>
                        Última doação foi {formatDistance(new Date(user.lastDonate), new Date(), { locale: ptBR} )}
                    </time>
                </div>
            </div>
            )}

            <SupportButton />
        </>
    )
}


// #Trabalhando na verificação do lado do servidor (se pode acessar s/login == false)
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession( {req} );

    // #Fazendo verificação se ele não tem uma Sessão existente! ( o " ? " para não dar erro caso o ID venha NULL)
    if(!session?.id){
        //# Mandando de volta para home
        return{
            redirect:{
                destination: '/',
                permanent: false
            }
        }
    }

    // Capturando tudo que estiver em tarefas (no db)
    const tasks = await firebase.firestore().collection('tarefas')
    .where('userId', '==', session?.id)
    .orderBy('created', 'asc').get();

    // Acessando os dados das taks (mapeando e adiconando campos(formatando))
    const data = JSON.stringify(tasks.docs.map(u => {
        return {
            id: u.id,
            createdFormat: format(u.data().created.toDate(), 'dd MMMM yyyy'),
            ...u.data(),
        }
    }))



    const user ={
        nome: session?.user.name,
        id: session?.id,
        vip: session?.vip,
        lastDonate: session?.lastDonate
    }

    return {
        props:{
            user,
            data
        }
    }
}