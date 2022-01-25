//# Document: componentes que vão ser carregados uma unica vez! (Statico)

import Document, { Html, Head, Main, NextScript} from "next/document";

export default class MyDocument extends Document{
    render(){
        return(
            <Html>
                <Head>
                    
                </Head>
                <body>
                    <Main /> 
                    <NextScript />
                </body>
            </Html>
        )
    }
}