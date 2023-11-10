import Button from "../../buttons/Button.jsx";
import "./styleSidebar.css"
import Logo from "../../../assets/images/gatto.jpg"

function Sidebar({windowWidth, navigationButtons, activeButton, changeActiveButton}) {
    const settingsBtn = navigationButtons[navigationButtons.length-1];

    const header = (
        <div className="header">
            <div className="logoAndName">
                <img className="logoPicture" alt="Logo foto" src={Logo}/>
                {windowWidth >= 760 &&
                    <h3 className="nameBrand">Squealer</h3>
                }
            </div>
        </div>
    );

    return (
        <>
            <div className="containerOfSidebar">
                <div className="sidebar">
                        {header}
                    <div className="allBtns">
                        <div className="containerOfTopButtons">
                            <div className="topButtons" >
                                {navigationButtons.map( (item) => (
                                        <div className="singolBtn" key={item.name} >
                                            <Button
                                                icon={item.icon}
                                                textDescription={item.name}

                                                isActive={item.id === activeButton}
                                                handleClick={() => changeActiveButton({id: item.id})}
                                                sideEffectFunction={() => console.log('mobile Nav click')}
                                            />
                                        </div>
                                        ))}
                            </div>
                        </div>
                        <div className="allSettings">
                            <div className="singolBtn" >
                                <Button
                                    icon = {settingsBtn.icon}
                                    textDescription={settingsBtn.name}

                                    isActive={settingsBtn.id === activeButton}
                                    handleClick={ () => changeActiveButton({id: settingsBtn.id})}
                                    sideEffectFunction={()=> console.log('ciao')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;