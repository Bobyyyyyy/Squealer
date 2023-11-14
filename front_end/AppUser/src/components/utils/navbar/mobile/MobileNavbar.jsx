import Button from "../../buttons/Button.jsx";

function MobileNavbar({navigationButtons, activeButton, changeActiveButton}) {
    return (
        <>
            <div className="containerOfNavbar">
                <div className="navbar">
                    <div className="allBtnsMobile">
                        {navigationButtons.map( (item) => {
                            return (item.id !==5) ? (
                                <div className="singolBtnMobile" key={item.name} >
                                    <Button
                                        icon={item.icon}
                                        textDescription={item.name}

                                        isActive={item.id === activeButton}
                                        handleClick={() => changeActiveButton({id: item.id})}
                                        sideEffectFunction={() => console.log('mobile Nav click')}
                                    />
                                </div>
                            ) : (
                                <></>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default MobileNavbar;