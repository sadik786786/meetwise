import Link from "next/link";
import {
  FiDollarSign,
  FiCalendar,
  FiFolder,
  FiClock,
  FiArrowRight
} from "react-icons/fi";

export default function RequirementCard({ requirement }) {
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatBudget = (amount) => {
    if (!amount) return "Flexible";
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${amount}`;
  };

  return (
    <Link href={`/seller/browse-requirements/${requirement.id}`}>
      <div className="group bg-white rounded-lg border border-gray-200 hover:border-green-400 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden h-full relative">
        {/* Urgency Indicator */}
        <div className={`absolute top-0 left-0 w-1.5 h-full ${getUrgencyColor(requirement.urgency)}`}></div>
        
        <div className="ml-4 p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 text-sm">
                {requirement.title}
              </h3>
            </div>
            <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0" />
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs">
              <FiFolder className="w-3 h-3" />
              <span>{requirement.category || "General"}</span>
            </div>
            
            {requirement.location && (
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs">
                <FiCalendar className="w-3 h-3" />
                <span>{requirement.duration || "Flexible"}</span>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex items-center gap-1">
              <FiDollarSign className="w-4 h-4 text-gray-500" />
              <span className="font-bold text-gray-900 text-sm">
                {formatBudget(requirement.budget)}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {requirement.deadline ? new Date(requirement.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'No deadline'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}