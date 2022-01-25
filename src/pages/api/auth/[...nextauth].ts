import NextAuth from "next-auth"
import Providers from "next-auth/providers";
import firebase from '../../../services/firebaseConnection';
export default NextAuth({

  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user' //#Em caso de duvida, olhar doc do github
    }),

  ],
  callbacks:{
    //#Para quando já estiver logado, manter a sessão
    async session(session, profile){
      
      try{

        //Pegando a ultima vez que o usuario doou
        const lastDonate = await firebase.firestore().collection('users')
        .doc(String(profile.sub))
        .get()
        .then((snapshot) => {
          // Verificando se existe o usuario nos donates
          if(snapshot.exists){
            return snapshot.data().lastDonate.toDate();
          }else{
            // Não existe donate
            return null;
          }
        })

        // Caso haja sucesso!
        return {
          ...session,
          id: profile.sub,
          vip: lastDonate ? true : false,
          lastDonate: lastDonate
        }; 
      }catch{
        return {
          // Retornando toda sessão com id vazio (não tem!)
          ...session,
          id: null,
          vip: false,
          lastDonate: null,
        }
      }
    },
    //#Quando não estiver logado, chamar essa função!
    async signIn(user, account, profile){
        const { email } = user;
        try{
          return true; //Login efetuado c/ sucesso!
        }catch(err){
          console.log(`Houve uma falha ao recuperar o email (signIn): ${err}`);
          return false; //para não efetuar o login
        }
    }
  }

});