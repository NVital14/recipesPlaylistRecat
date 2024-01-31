import React, { createContext, useEffect, useState } from 'react';
import './firebaseConfig';
import { ShellBar, StandardListItem, Avatar, Input, Icon, Button } from '@ui5/webcomponents-react';
import { getFirestore, addDoc, collection, getDocs } from "firebase/firestore";
import logoImg from './images/logo.png';
import rpImg from './images/rp.png';
import RecipeItem from './components/recipeItem';
import NewRecipe from './screens/newRecipe';
import FilterButton from './components/filterButton';
import ViewRecipe from './components/viewRecipe';
import SignUp from './components/signUp';
import { HashRouter, Route, Routes } from 'react-router-dom';
import SignUpScreen from './screens/signUpScreen';
import InicialScreen from './screens/inicialScreen';
import LogIn from './components/logIn';
import LogInScreen from './screens/logInScreen';
import FavoritesScreen from './screens/favoritesScreen';
import CRUDScreen from './screens/crudScreen';


export const ROUTES = {
  SIGN_UP: '/sign-up',
  LOG_IN: '/log-in',
  INICIO: '/recipes',
  FAVORITES: '/favorites',
  CRUD: '/crud'
}

export const AuthContext = createContext({
  user: null,
  setUser: () => { }
})


function App() {
  // state oara atuencicao
  const [authData, setAuthData] = useState({ user: null });

    const setUser = (user) => {
      setAuthData((data) => ({ ...data, user: user }))
    }


  return (
    <AuthContext.Provider value={{ ...authData, setUser }}>
      <HashRouter>
        <Routes>
          {/* {isAuthenticated ? <>
        
        
        </> : <>
        
        </>} */}
          <Route path='/' element={<LogInScreen />} />
          <Route key={ROUTES.LOG_IN} path={ROUTES.LOG_IN} element={<LogInScreen />} />
          <Route key={ROUTES.SIGN_UP} path={ROUTES.SIGN_UP} element={<SignUpScreen />} />
          <Route key={ROUTES.INICIO} path={ROUTES.INICIO} element={<InicialScreen />} />
          <Route key={ROUTES.FAVORITES} path={ROUTES.FAVORITES} element={<FavoritesScreen />} />
          <Route key={ROUTES.CRUD} path={ROUTES.CRUD} element={<CRUDScreen />} />

        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );


}

export default App;
// function App() {

//   let [storedRecipes, setStoredRecipes] = useState([]);
//   let [isOpen, setIsOpen] = useState(false);
//   let [selected, setSelected] = useState(null);

//   const db = getFirestore();

//   const fetchDataFromFirestore = async () => {
//     const querySnapshot = await getDocs(collection(db, "myRecipes"));
//     const temporaryArr = [];
//     querySnapshot.forEach((doc) => {
//       temporaryArr.push(doc.data());
//     });
//     setStoredRecipes(temporaryArr);
//   };

//   useEffect(() => {

//     fetchDataFromFirestore();
//   }, [])


//   return (

//     <div className="App">
//       <ShellBar
//         logo={<img alt="Logo" src={logoImg} />}
//         menuItems={<><StandardListItem data-key="1">Menu Item 1</StandardListItem><StandardListItem data-key="2">Menu Item 2</StandardListItem><StandardListItem data-key="3">Menu Item 3</StandardListItem></>}
//         profile={<Button className='btnOthers'> Entrar</Button>}
//         onLogoClick={function _a() { }}
//         onMenuItemClick={function _a() { }}
//         onNotificationsClick={function _a() { }}
//         onProductSwitchClick={function _a() { }}
//         onProfileClick={function _a() { }}
//         primaryTitle="MENU"

//       ></ShellBar>
//       <center>
//         <img src={rpImg} />
//         <div style={{ display: 'flex', width: '50%', marginTop: '4%' }}>

//           <FilterButton category="Aperitivo" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
//           <FilterButton category="Entrada" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
//           <FilterButton category="Sopa" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
//           <FilterButton category="Peixe" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
//           <FilterButton category="Sobremesa" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
//           <FilterButton category="Vegetariano" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
//           <FilterButton category="Vegan" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
//           <FilterButton category="Bebida" storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes}></FilterButton>
//         </div>

//         <div style={{
//           width: '720px'
//         }}>

//           {storedRecipes.map((item, index) => (
//             <RecipeItem storedRecipes={storedRecipes} setStoredRecipes={setStoredRecipes} item={item} isOpen={isOpen} setIsOpen={setIsOpen} setSelected={setSelected}> </RecipeItem>))}
//         </div>

//         <ViewRecipe isOpen={isOpen} setIsOpen={setIsOpen} data={selected} />
//       </center >
//       <NewRecipe></NewRecipe>



//     </div >

//   );
// }

// export default App;
// function App() {
//   const [inputValue1, setInputValue1] = useState('');
//   const [inputValue2, setInputValue2] = useState('');
//   let [storedRecipes, setStoredRecipes] = useState([]);

//   const db = getFirestore();

//   const saveDataToFirestore = async () => {
//       const docRef = await addDoc(collection(db, "myCollection"), {
//         field1: inputValue1,
//         field2: inputValue2,
//       });
//       alert("Document written to Database");
//   };

//   const fetchDataFromFirestore = async () => {
//     const querySnapshot = await getDocs(collection(db, "myCollection"));
//     const temporaryArr = [];
//     querySnapshot.forEach((doc) => {
//         temporaryArr.push(doc.data());
//     });
//     setStoredRecipes(temporaryArr);
// };

//   return (
//     <div className="App">
//       <h1>Save Data to Firebase Firestore</h1>
//       <input
//         type="text"
//         value={inputValue1}
//         onChange={(e) => setInputValue1(e.target.value)}
//       />
//       <input
//         type="text"
//         value={inputValue2}
//         onChange={(e) => setInputValue2(e.target.value)}
//       />
//       <button onClick={saveDataToFirestore}>Save to Firestore</button> <br></br>
//       <button onClick={fetchDataFromFirestore}>Fetch from Firestore</button>

//       <div>
//         {storedRecipes.map((item, index) => (
//           <div key={index}>
//             <p>{item.field1}: {item.field2}</p>
//           </div>

//         ))}
//       </div>
//     </div>

//   );
// }

// export default App;
