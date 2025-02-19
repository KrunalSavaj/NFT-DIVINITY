import { PulseLoader } from "react-spinners"

function MiniLoader({ color = "#ffff" }) {
    return (
        <div>
             <PulseLoader className="ml-5" color={`${color}`} speedMultiplier={0.8} />
        </div>
    )
}

export default MiniLoader;
