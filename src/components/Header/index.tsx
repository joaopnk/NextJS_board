import Link from "next/link";
import Image from "next/image";

// Importando nossa img
import logo from '../../../public/images/logo.svg'; 

// # CSS
import styles from "./styles.module.scss";

// # Componentes
import {SignButton} from '../SignInButton';
export function Header(){
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/">
                    <a>
                        <Image src={logo} alt="Logo meu board" />
                    </a>
                </Link>
                <nav>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                    <Link href="/board">
                        <a>Meu board</a>
                    </Link>
                </nav>

                <SignButton />
            </div>
        </header>
    )
}