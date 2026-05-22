import { CircleHelp } from "lucide-react";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="logo">
        Weather App - Abril Elisiri
      </div>

      <button className="info-button">
        <CircleHelp size={20} />
        <div className="info-tooltip">
            <h4>About PM Accelerator</h4>
            <p>
                Product Manager Accelerator (PMA) is a comprehensive training program 
                designed to help aspiring and current product managers accelerate their 
                careers. PMA provides hands-on experience through real-world projects, 
                mentorship from industry leaders, and a structured curriculum covering 
                product strategy, roadmapping, user research, data analysis, and 
                go-to-market execution. The program bridges the gap between theory and 
                practice, equipping participants with the skills and portfolio needed to 
                land and excel in top PM roles at leading tech companies.
            </p>
        </div>
    </button>
    </div>
  );
}