import '../App.css';
import { Card, Icon } from '@ui5/webcomponents-react';


const RecipeItem = ({ setIsOpen, setSelected, ...props }) => {

    return (
        <center>
            <div className='height-div'></div>
            <Card style={{
                width: '100%'
            }}
                onClick={() => {
                    setIsOpen(true)
                    setSelected(props.item)
                }}>
                <div>
                    <p className='recipe-title'> {props.item.title}</p>
                    <img src={props.item.image} style={{ width: '95%' }}></img>
                    <center>
                        <div style={{ display: 'flex', height: '50px' }} >
                            <div style={{ display: 'flex', width: '10%' }}></div>
                            <div style={{ display: 'flex', width: '23%', marginBottom: '8px', marginTop: '9px' }} >
                                <table>
                                    <tr>
                                        <td><Icon name="lateness" style={{height:'25px', width:'20px'}} /></td>
                                        <td><span className='labelText'>{props.item.time}</span></td>
                                        <td> <span className='labelText' style={{ marginRight: '4px' }} >min</span></td>
                                    </tr>
                                </table>

                            </div>
                            <div style={{ display: 'flex', width: '10%' }}></div>
                            <div style={{ display: 'flex', width: '23%', marginBottom: '8px', marginTop: '8px' }} >

                                <table>
                                    <tr>
                                        <td><Icon name="suitcase" style={{height:'25px', width:'20px'}}/></td>
                                        <td><span className='labelText'>{props.item.complexity}</span></td>
                                    </tr>
                                </table>


                            </div>
                            <div style={{ display: 'flex', width: '10%' }}></div>
                            <div style={{ display: 'flex', width: '23%', marginBottom: '8px', marginTop: '8px' }} >
                                <table>
                                    <tr>
                                        <td><Icon name="lead" style={{height:'25px', width:'20px'}}/></td>
                                        <td><span className='labelText'>{props.item.affordability}</span></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </center>
                </div>
            </Card>

        </center >
    );
};

export default RecipeItem;
