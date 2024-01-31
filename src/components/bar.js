import '../firebaseConfig';
import { auth } from '../firebaseConfig';
import { ShellBar, StandardListItem} from '@ui5/webcomponents-react';
import logoImg from '../images/recipesPlaylist.png';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../App';



function AppBar({admin, user}) {
    const navigate = useNavigate();

    return (

        <div className="App">
            <ShellBar
                logo={<img alt="Logo" src={logoImg} />}
                menuItems={
                    <>
                        <StandardListItem data-key="1">Início</StandardListItem>
                        <StandardListItem data-key="2">Favoritos</StandardListItem>
                        {user === admin[0]?.userId ? <StandardListItem data-key="3">Receitas</StandardListItem> : null}
                        <StandardListItem data-key="4">Sair</StandardListItem></>}
                onMenuItemClick={async (e) => {
                    console.log(e.detail.item.dataset.key);
                    switch (e.detail.item.dataset.key) {
                        case '1': {
                            navigate(ROUTES.INICIO);
                            break;
                        }
                        case '2': {
                            navigate(ROUTES.FAVORITES);
                            break;
                        }
                        case '3': 
                        navigate(ROUTES.CRUD);
                        break;
                        case '4': {
                            await signOut(auth);
                            navigate(ROUTES.LOG_IN);
                            break;
                        }
                    }
                }}


                primaryTitle="MENU"

            ></ShellBar>



        </div >

    );
}

export default AppBar;