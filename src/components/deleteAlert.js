import { Button, Dialog } from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/AllIcons.js';



const DeleteAlert = ({ isOpen, setIsOpen, deleteRecipe}) => {

    console.log('iniside');
    return (
        <Dialog
            style={{ width: '50%' }}
            open={isOpen}
            headerText='Eliminar Receita'
            footer={<div><Button
                className='btnOthers'
                onClick={() => deleteRecipe}
            >
                SIM
            </Button>
                <Button style={{color:'#000000'}} onClick={() => setIsOpen(false)}>CANCELAR</Button></div>}
        >
            Tem a certeza que quer elinar a receita?
        </Dialog>
    );
};

export default DeleteAlert;
