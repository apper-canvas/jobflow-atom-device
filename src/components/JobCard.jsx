import { motion } from 'framer-motion'
import ApperIcon from './ApperIcon'

const JobCard = ({ job, isSelected, isSaved, onClick, onSave }) => {
  const handleSaveClick = (e) => {
    e.stopPropagation()
    onSave()
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`bg-white rounded-lg p-6 shadow-sm border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary shadow-md' 
          : 'border-transparent hover:border-surface-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-surface-800 mb-1 break-words">
            {job.title}
          </h3>
          <p className="text-surface-600 mb-2 break-words">{job.company}</p>
          <div className="flex flex-wrap items-center text-sm text-surface-500 gap-4">
            <span className="flex items-center">
              <ApperIcon name="MapPin" className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="break-words">{job.location}</span>
            </span>
            <span className="flex items-center">
              <ApperIcon name="Clock" className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>{job.type}</span>
            </span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSaveClick}
          className={`ml-4 p-2 rounded-full transition-colors flex-shrink-0 ${
            isSaved 
              ? 'bg-accent/10 text-accent' 
              : 'bg-surface-100 text-surface-400 hover:bg-surface-200 hover:text-surface-600'
          }`}
        >
          <ApperIcon name={isSaved ? "Bookmark" : "BookmarkPlus"} className="w-5 h-5" />
        </motion.button>
      </div>

      <p className="text-surface-700 text-sm mb-4 line-clamp-2 break-words">
        {job.description}
      </p>

      <div className="flex items-center justify-between">
        {job.salary && (
          <div className="text-primary font-semibold">
            ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}
          </div>
        )}
        <div className="flex items-center text-xs text-surface-500">
          <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
          <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
        </div>
      </div>

      {job.requirements && job.requirements.length > 0 && (
        <div className="mt-4 pt-4 border-t border-surface-200">
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 3).map((req, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-surface-100 text-surface-600 text-xs rounded-full break-words"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="px-2 py-1 bg-surface-100 text-surface-600 text-xs rounded-full">
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default JobCard