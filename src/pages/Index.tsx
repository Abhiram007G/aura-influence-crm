import Dashboard from "./Dashboard";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div>
      <Dashboard />
      <div className="mt-8 flex justify-center">
        <Link to="/campaigns/chat-new">
          <button className="premium-button px-6 py-2 text-lg font-semibold">Try AI Campaign Brief (Chat Style)</button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
