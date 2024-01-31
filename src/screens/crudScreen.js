import React, { useRef, useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from '../firebaseConfig';
import '../firebaseConfig';
import RecipeItem from '../components/recipeItem';
import ViewRecipe from '../components/viewRecipe';
import NewRecipe from './newRecipe';
import Pagination from '../components/pagination';
import { Button } from '@ui5/webcomponents-react';
import AppBar from '../components/bar';
import { ROUTES } from '../App';
import { useNavigate } from 'react-router-dom';

function CRUDScreen() {
    let user = useRef();
    const [isNewRecipeOpen, setIsNewRecipeOpen] = useState(false);
    const [isViewRecipeOpen, setIsViewRecipeOpen] = useState(false);
    const [storedRecipes, setStoredRecipes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false); //aqui não é usado para nada, simplesmente para enviar os parâmetros
    const [admin, setAdmin] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const db = getFirestore();

    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 8;

    const lastRecipeIndex = currentPage * recipesPerPage;
    const firstRecipeIndex = lastRecipeIndex - recipesPerPage;
    const currentRecipes = storedRecipes.slice(firstRecipeIndex, lastRecipeIndex);



    useEffect(() => {
        if (auth.currentUser == null) {
            navigate(ROUTES.LOG_IN);
        }
        else {
            user.current = auth.currentUser.uid;
            fetchDataFromFirestore("myRecipes", setStoredRecipes);
            fetchDataFromFirestore("admin", setAdmin);

            window.addEventListener('resize', () => { setWidth(window.innerWidth) });

            return () => {
                window.removeEventListener('resize', () => { setWidth(window.innerWidth) });
            };
        }
    }, [])

    useEffect(() => {
        if (auth.currentUser != null) {
            fetchDataFromFirestore("myRecipes", setStoredRecipes);
        }
    }, [isViewRecipeOpen])
    const fetchDataFromFirestore = async (col, set) => {
        const querySnapshot = await getDocs(collection(db, col));
        const temporaryArr = [];
        querySnapshot.forEach((doc) => {
            temporaryArr.push(doc.data());
        });
        set(temporaryArr);

    };


    return (
        <div className="App">
            <AppBar admin={admin} user={user.current}></AppBar>
            <div className='scrollable' style={{ height: 'calc(100vh - 52px)', overflowY: 'auto' }} >
                <Button className='btnAddRecipe' icon='add' onClick={() => { setIsNewRecipeOpen(true) }}>
                    ADICIONAR RECEITA
                </Button>
                <div >
                    <NewRecipe isOpen={isNewRecipeOpen} setIsOpen={setIsNewRecipeOpen}></NewRecipe>
                </div>
                <center>
                    <div style={{
                        width: width <= 800 ? '100%' : '720px'
                    }}>

                        {currentRecipes.map((item, index) => (
                            <RecipeItem key={item.id} storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes} item={item} isOpen={isViewRecipeOpen} setIsOpen={setIsViewRecipeOpen} setSelected={setSelected}> </RecipeItem>))}
                        <ViewRecipe isOpen={isViewRecipeOpen} setIsOpen={setIsViewRecipeOpen} data={selected}
                            isFavorite={isFavorite} setIsFavorite={setIsFavorite} user={user.current} btnCRUD={true} />

                        <Pagination
                            totalRecipes={storedRecipes.length}
                            recipesPerPage={recipesPerPage}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                        ></Pagination>

                    </div>
                </center>
            </div>


        </div>



    );
}
export default CRUDScreen;