import React, { useRef, useEffect, useState } from 'react';
import '../firebaseConfig';
import { auth } from '../firebaseConfig';
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import AppBar from '../components/bar';
import RecipeItem from '../components/recipeItem';
import ViewRecipe from '../components/viewRecipe';
import { ROUTES } from '../App';
import { useNavigate } from 'react-router-dom';




function FavoritesScreen() {
    // const user = useContext(AuthContext);
    let user = useRef();
    const [favorites, setFavorites] = useState([]);
    const [storedRecipes, setStoredRecipes] = useState([]);
    const [selected, setSelected] = useState(null);
    const [isFavorite, setIsFavorite] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const [admin, setAdmin] = useState([]);
    const db = getFirestore();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.currentUser == null) {
            navigate(ROUTES.LOG_IN);
        }
        else {
            user.current = auth.currentUser.uid;
            inic();
            window.addEventListener('resize', () => { setWidth(window.innerWidth) });
            window.addEventListener('resize', () => { setHeight(window.innerHeight) });

            return () => {
                window.removeEventListener('resize', () => { setWidth(window.innerWidth) });
                window.removeEventListener('resize', () => { setHeight(window.innerHeight) });

            };
        }
    }, [])

    useEffect(() => {
        if (auth.currentUser != null) {
            whenViewRecipeIsOpen();
        }
    }, [isOpen])
    const fetchDataFromFirestore = async (col, set) => {
        const querySnapshot = await getDocs(collection(db, col));
        const temporaryArr = [];
        querySnapshot.forEach((doc) => {
            temporaryArr.push(doc.data());
        });
        set(temporaryArr);

    };
    const fetchFavoritesFromFirestore = async () => {
        const querySnapshot = await getDocs(query(collection(db, "favorites"), where('userId', '==', user.current)));
        const temporaryArr = [];
        querySnapshot.forEach((doc) => {
            temporaryArr.push(doc.data());
        });
        console.log('Fetch favorites');
        console.log(temporaryArr);

        setFavorites(temporaryArr);

    };



    async function inic() {
        await fetchDataFromFirestore("myRecipes", setStoredRecipes);
        await fetchDataFromFirestore("admin", setAdmin);
        await fetchFavoritesFromFirestore();

    }

    async function whenViewRecipeIsOpen() {
        await fetchFavoritesFromFirestore();

    }




    return (
        <div>
            <AppBar admin={admin} user={user.current}></AppBar>
            <div className='scrollable' style={{ height: 'calc(100vh - 52px)', overflowY: 'auto' }} >
                {favorites.length >= 1 ?
                    <center>
                        <div style={{
                            width: width <= 800 ? '100%' : '720px'
                        }}>
                            {favorites.map((item) =>
                            (storedRecipes
                                .filter(recipe => recipe.id == item.recipeId)
                                .map(filteredRecipe =>
                                    (<RecipeItem key={filteredRecipe.id} item={filteredRecipe} isOpen={isOpen} setIsOpen={setIsOpen} setSelected={setSelected}>  </RecipeItem>))))}

                            <ViewRecipe isOpen={isOpen} setIsOpen={setIsOpen} data={selected}
                                isFavorite={isFavorite} setIsFavorite={setIsFavorite} user={user.current} btnFavorite={true} btnCRUD={false} />

                        </div>
                    </center>
                    : <center> <p className='recipe-title'>Ainda não tem favoritos! Comece a adicionar!!</p> </center>}
            </div>


        </div>
    );
}

export default FavoritesScreen;