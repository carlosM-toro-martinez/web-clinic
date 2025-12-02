import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackArrow = ({ className = "", size = 24, color = "currentColor" }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleGoBack}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer ${className}`}
      aria-label="Volver atrás"
    >
      <ArrowLeft size={40} />
    </button>
  );
};

export default BackArrow;
