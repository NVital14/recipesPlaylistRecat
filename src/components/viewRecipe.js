import '../App.css';
import React, { useEffect, useState } from 'react';
import { doc, query, getFirestore, addDoc, collection, updateDoc, where, getDocs, deleteDoc } from "firebase/firestore";
import { TextArea, Button, Dialog, Bar, Form, FormItem, Input, Select, Option, Label, FormGroup, MessageBox, sap } from '@ui5/webcomponents-react';
import { getStorage, getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import '@ui5/webcomponents-icons/dist/AllIcons.js';
import UploadAndDisplayImage from './uploadAndDisplayImage';




const ViewRecipe = ({ isOpen, setIsOpen, data, isFavorite, setIsFavorite, user, btnFavorite, btnCRUD }) => {
    const db = getFirestore();
    const [inputTitle, setInputTitle] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [inputTime, setInputTime] = useState('');
    const [inputCategory, setInputCategory] = useState('');
    const [inputComplexity, setInputComplexity] = useState('');
    const [inputAffordability, setInputAffordability] = useState('');
    const [inputIngredients, setInputIngredients] = useState('');
    const [inputSteps, setInputSteps] = useState('');
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {

        window.addEventListener('resize', () => { setWidth(window.innerWidth) });

        return () => {
            window.removeEventListener('resize', () => { setWidth(window.innerWidth) });

        };
    }, []);
    useEffect(() => {
        setInputTitle(data?.title);
        setInputTime(data?.time);
        setInputCategory(data?.category);
        setInputAffordability(data?.affordability);
        setInputComplexity(data?.complexity);
        setInputIngredients(data?.ingredients);
        setInputSteps(data?.steps);
    }, [isOpen])

    async function addOrDeleteFavorite() {
        if (!isFavorite) {
            try {
                let values = {
                    recipeId: data?.id,
                    userId: user
                };
                const docRef = await addDoc(collection(db, "favorites"), values);
                values['id'] = docRef.id;
                await updateDoc(doc(db, 'favorites/' + docRef.id), {
                    id: values.id,
                });
                setIsFavorite(true);
            } catch (error) {
                alert(error);
            }

        }
        else {
            const favoritesCollection = collection(db, 'favorites');
            const q = query(favoritesCollection, where('userId', '==', user), where('recipeId', '==', data.id));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            setIsFavorite(false);
        }

    }

    function getPathStorageFromUrl(url) {
        const baseUrl = "https://firebasestorage.googleapis.com/v0/b/recipesplaylistreact.appspot.com/o/";
        let imagePath = url.replace(baseUrl, "");
        const indexOfEndPath = imagePath.indexOf("?");
        imagePath = imagePath.substring(0, indexOfEndPath);
        imagePath = imagePath.replace("%2F", "/");
        return imagePath;
    }

    async function saveChanges() {
        const storage = getStorage();
        let url;
        try {

            if (inputTitle !== '' && inputTime !== '' && inputIngredients !== '' && inputSteps !== '') {
                if (selectedImage !== null && data.image !== null) {
                    const imagePath = getPathStorageFromUrl(data.image);
                    const fileRef = ref(storage, imagePath);
                    await deleteObject(fileRef);

                }
                if (selectedImage != null) {
                    //adicionar nova imagem
                    const storageRef = ref(storage, `/imagens/${crypto.randomUUID()}`);
                    const uploadTask = await uploadBytesResumable(storageRef, selectedImage);
                    url = await getDownloadURL(uploadTask.ref);
                    url = url.toString().trim();
                }

                await updateDoc(doc(db, 'myRecipes/' + data.id), {
                    title: inputTitle,
                    time: inputTime,
                    category: inputCategory,
                    image: selectedImage ? url : data.image ? data.image : null,
                    complexity: inputComplexity,
                    affordability: inputAffordability,
                    ingredients: inputIngredients,
                    steps: inputSteps
                });
                alert("Alterações guardadas com sucesso!!!");
                setIsOpen(false);
            } else {
                alert("Os campos do título, do tempo, dos ingredientes e dos passos, são de preenchimento obrigatório");
            }

        } catch (error) {
            alert(error);
        }

    }

    // const deleteRecipe = async () => {
    async function deleteRecipe() {

        if (window.confirm('Tem a certeza que quer eliminar a receita?')) {
            try {
                
                if (data.image != null) {
                    const storage = getStorage();
                    const imagePath = getPathStorageFromUrl(data.image);
                    const fileRef = ref(storage, imagePath);
                    await deleteObject(fileRef);
                }
                const myRecipesCollection = collection(db, 'myRecipes');
                const q = query(myRecipesCollection, where('id', '==', data.id));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });

                setIsOpen(false);
                alert("Receita Eliminada com sucesso");


            } catch (error) {
                alert('Não foi possível eliminar a receita!');
            }
            console.log('Thing was saved to the database.');
        } else {
            // Do nothing!
            console.log('Thing was not saved to the database.');
        }


    }



    return (
        <Dialog
            open={isOpen}
            onAfterClose={() => setIsOpen(false)}
            footer={<Bar design="Footer" endContent={<div style={{
                heigth: width <=1110 ? '100px': '30px'
            }}>{btnFavorite ? <Button
                className='btnOthers'
                icon={isFavorite ? "favorite" : "add-favorite"}
                onClick={() => addOrDeleteFavorite()}
            >
                {isFavorite ? "Favorito" : "Adicionar aos Favoritos"}
            </Button> : null}
                {btnCRUD ? <Button
                    className='btnOthers'
                    icon="save"
                    onClick={() => saveChanges()}
                >
                    Guardar alterações
                </Button> : null}
                {btnCRUD ? <Button
                    className='btnOthers'
                    icon="delete"
                    onClick={() => { deleteRecipe() }}
                >
                    Eliminar
                </Button> : null}
                <Button className='btnOthers' onClick={() => {
                    setIsOpen(false)
                    setSelectedImage(null);
                }}>Fechar</Button></div>} />}
            header={<p className='recipe-title'>{data?.title}</p>}
            style={{ width: '40%' }}

        >

            {
                <div>
                    <img src={data?.image} style={{ width: '95%' }}></img>
                    <Form>{btnCRUD ? <FormItem label="Título">
                        <Input value={inputTitle}
                            onChange={(e) => setInputTitle(e.target.value)} style={{
                                width: '50%'
                            }} />
                    </FormItem> : null}

                        {btnCRUD ?
                            <FormItem label="Imagem">
                                <UploadAndDisplayImage selectedImage={selectedImage} setSelectedImage={setSelectedImage}></UploadAndDisplayImage>
                            </FormItem>
                            : null}


                        <FormGroup titleText="Detalhes">
                            <FormItem label="Tempo">
                                <Input value={inputTime}
                                    readonly={btnCRUD ? false : true}
                                    onChange={(e) => setInputTime(e.target.value)} />
                            </FormItem>
                            <FormItem label="Complexidade">
                                <Select value={inputComplexity} readonly={btnCRUD ? false : true} onChange={(e) => setInputComplexity(e.target.value)}>
                                    <Option>
                                        {inputComplexity}
                                    </Option>
                                    <Option>
                                        {inputComplexity == 'Simples' ? 'Médio' : inputComplexity == 'Médio' ? 'Simples' : inputComplexity == 'Difícil' ? 'Simples' : null}
                                    </Option>
                                    <Option>
                                        {inputComplexity == 'Simples' ? 'Difícil' : inputComplexity == 'Médio' ? 'Difícil' : inputComplexity == 'Difícil' ? 'Médio' : null}
                                    </Option>
                                </Select>
                            </FormItem>

                            <FormItem label="Acessibilidade">
                                <Select value={inputAffordability} readonly={btnCRUD ? false : true} onChange={(e) => setInputAffordability(e.target.value)}>
                                    <Option>
                                        {inputAffordability}
                                    </Option>
                                    <Option>
                                        {inputAffordability == 'Acessível' ? 'Caro' : inputAffordability == 'Caro' ? 'Acessível' : inputAffordability == 'Muito Caro' ? 'Acessível' : null}

                                    </Option>
                                    <Option>
                                        {inputAffordability == 'Acessível' ? 'Muito Caro' : inputAffordability == 'Caro' ? 'Muito Caro' : inputAffordability == 'Muito Caro' ? 'Caro' : null}
                                    </Option>
                                </Select>
                            </FormItem>

                            <FormItem label="Categoria">
                                <Select value={inputCategory} readonly={btnCRUD ? false : true} onChange={(e) => setInputCategory(e.target.value)}>
                                    <Option>
                                        {inputCategory}
                                    </Option>
                                    <Option>
                                        Aperitivo
                                    </Option>
                                    <Option>
                                        Entrada
                                    </Option>
                                    <Option>
                                        Sopa
                                    </Option>
                                    <Option>
                                        Carne
                                    </Option>
                                    <Option>
                                        Peixe
                                    </Option>
                                    <Option>
                                        Sobremesa
                                    </Option>
                                    <Option>
                                        Vegetariano
                                    </Option>
                                    <Option>
                                        Vegan
                                    </Option>
                                    <Option>
                                        Bebida
                                    </Option>
                                </Select>
                            </FormItem>

                        </FormGroup>
                        <FormGroup titleText="Receita">

                            <FormItem label={<Label style={{ alignSelf: 'start', paddingTop: '0.25rem' }}>Ingredientes</Label>}>
                                <TextArea
                                    value={inputIngredients}
                                    readonly={btnCRUD ? false : true}
                                    onChange={(e) => setInputIngredients(e.target.value)}
                                    growing={true}
                                    rows={8}

                                    style={{ width: '80%' }}
                                />
                            </FormItem>
                            <FormItem label={<Label style={{ alignSelf: 'start', paddingTop: '0.25rem' }}>Passos</Label>}>
                                <TextArea
                                    value={inputSteps}
                                    readonly={btnCRUD ? false : true}
                                    onChange={(e) => setInputSteps(e.target.value)}
                                    growing={true}
                                    rows={8}
                                    style={{ width: '80%' }}
                                />
                            </FormItem>
                        </FormGroup>

                    </Form>

                </div>

            }
        </Dialog >
    );
};

export default ViewRecipe;
