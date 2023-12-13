import {useLoaderData} from "react-router-dom";

function PageProfileByName() {
    const {username} = useLoaderData();
    return (
        <div>
            {username}
        </div>
    );
}

export default PageProfileByName;