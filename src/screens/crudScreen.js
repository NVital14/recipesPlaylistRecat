import React, { useContext, useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from '../firebaseConfig';
import '../firebaseConfig';
import RecipeItem from '../components/recipeItem';
import ViewRecipe from '../components/viewRecipe';
import NewRecipe from './newRecipe';
import Pagination from '../components/pagination';
import { Button } from '@ui5/webcomponents-react';
import AppBar from '../components/bar';

function CRUDScreen() {
    const user = auth.currentUser.uid;
    const [isNewRecipeOpen, setIsNewRecipeOpen] = useState(false);
    const [isViewRecipeOpen, setIsViewRecipeOpen] = useState(false);
    const [storedRecipes, setStoredRecipes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false); //aqui não é usado para nada, simplesmente para enviar os parâmetros
    const [admin, setAdmin] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);

    const db = getFirestore();

    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 8;

    const lastRecipeIndex = currentPage * recipesPerPage;
    const firstRecipeIndex = lastRecipeIndex - recipesPerPage;
    const currentRecipes = storedRecipes.slice(firstRecipeIndex, lastRecipeIndex);


    const fetchDataFromFirestore = async (col, set) => {
        const querySnapshot = await getDocs(collection(db, col));
        const temporaryArr = [];
        querySnapshot.forEach((doc) => {
            temporaryArr.push(doc.data());
        });
        set(temporaryArr);

    };

    useEffect(() => {

        fetchDataFromFirestore("myRecipes", setStoredRecipes);
        fetchDataFromFirestore("admin", setAdmin);

        
        window.addEventListener('resize', () => { setWidth(window.innerWidth) });

        return () => {
            window.removeEventListener('resize', () => { setWidth(window.innerWidth) });
        };
    }, [])

    useEffect(() => {

        fetchDataFromFirestore("myRecipes", setStoredRecipes);
    }, [isViewRecipeOpen])
    return (
        <div className="App">
            <AppBar admin={admin} user={user}></AppBar>
            <Button className='btnAddRecipe' icon='add' onClick={() => { setIsNewRecipeOpen(true) }}>
                ADICIONAR RECEITA
            </Button>
            <div >
                <NewRecipe isOpen={isNewRecipeOpen} setIsOpen={setIsNewRecipeOpen}></NewRecipe>
            </div>
            <center>
                <div style={{
                    width:  width <= 800 ? '100%':'720px' 
                }}>

                    {currentRecipes.map((item, index) => (
                        <RecipeItem key={item.id} storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes} item={item} isOpen={isViewRecipeOpen} setIsOpen={setIsViewRecipeOpen} setSelected={setSelected}> btnFavorite={true} btnCRUD={false}</RecipeItem>))}
                    <ViewRecipe isOpen={isViewRecipeOpen} setIsOpen={setIsViewRecipeOpen} data={selected}
                        isFavorite={isFavorite} setIsFavorite={setIsFavorite} user={user} btnCRUD={true} />

                    <Pagination
                        totalRecipes={storedRecipes.length}
                        recipesPerPage={recipesPerPage}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                    ></Pagination>

                </div>
            </center>

        </div>



    );
}
export default CRUDScreen;