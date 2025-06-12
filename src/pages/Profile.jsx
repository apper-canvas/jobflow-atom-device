import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { userService } from '../services'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState('personal')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
    summary: '',
    skills: [],
    experience: [],
    education: []
  })
  const [newSkill, setNewSkill] = useState('')
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  })
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeUploading, setResumeUploading] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        const userData = await userService.getById('user1') // In a real app, this would come from auth
        setUser(userData)
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          location: userData.location || '',
          headline: userData.headline || '',
          summary: userData.summary || '',
          skills: userData.skills || [],
          experience: userData.experience || [],
          education: userData.education || []
        })
      } catch (err) {
        setError(err.message || 'Failed to load profile')
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updatedUser = await userService.update('user1', formData)
      setUser(updatedUser)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleAddExperience = () => {
    if (newExperience.title && newExperience.company) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience, id: Date.now() }]
      }))
      setNewExperience({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      })
    }
  }

  const handleRemoveExperience = (experienceId) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== experienceId)
    }))
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB')
      return
    }

    setResumeUploading(true)
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      const resumeUrl = `resume-${Date.now()}.pdf`
      
      const updatedUser = await userService.update('user1', { resumeUrl })
      setUser(updatedUser)
      setResumeFile(file)
      toast.success('Resume uploaded successfully')
    } catch (err) {
      toast.error('Failed to upload resume')
    } finally {
      setResumeUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-1/4"></div>
                  <div className="h-10 bg-surface-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-800 mb-2">Failed to load profile</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-90 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: 'User' },
    { id: 'experience', label: 'Experience', icon: 'Briefcase' },
    { id: 'skills', label: 'Skills', icon: 'Award' },
    { id: 'resume', label: 'Resume', icon: 'FileText' }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold font-heading text-surface-800 mb-2">
          Profile Settings
        </h1>
        <p className="text-surface-600">
          Update your profile information to help employers find you
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-white'
                      : 'text-surface-700 hover:bg-surface-50'
                  }`}
                >
                  <ApperIcon name={section.icon} className="w-4 h-4 mr-3" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Personal Information */}
            {activeSection === 'personal' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-surface-800 mb-4">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => handleInputChange('headline', e.target.value)}
                    className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Professional Summary
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Write a brief summary of your professional background and goals..."
                  />
                </div>
              </motion.div>
            )}

            {/* Experience Section */}
            {activeSection === 'experience' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-surface-800 mb-4">
                  Work Experience
                </h2>

                {/* Existing Experience */}
                <div className="space-y-4">
                  {formData.experience.map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-surface-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-surface-800">{exp.title}</h3>
                          <p className="text-surface-600">{exp.company}</p>
                          <p className="text-sm text-surface-500">
                            {exp.location} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveExperience(exp.id)}
                          className="text-error hover:text-error/80 transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                      {exp.description && (
                        <p className="text-surface-700 text-sm mt-2">{exp.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Add New Experience */}
                <div className="border-2 border-dashed border-surface-300 rounded-lg p-4">
                  <h3 className="font-medium text-surface-800 mb-4">Add New Experience</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={newExperience.title}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Job Title"
                      className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Company Name"
                      className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={newExperience.location}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Location"
                      className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="month"
                      value={newExperience.startDate}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, startDate: e.target.value }))}
                      className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="month"
                      value={newExperience.endDate}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, endDate: e.target.value }))}
                      disabled={newExperience.current}
                      className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-surface-100"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newExperience.current}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, current: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-surface-700">Current Position</span>
                    </label>
                  </div>
                  <textarea
                    value={newExperience.description}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                    className="w-full mt-4 px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    onClick={handleAddExperience}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-90 transition-all"
                  >
                    Add Experience
                  </button>
                </div>
              </motion.div>
            )}

            {/* Skills Section */}
            {activeSection === 'skills' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-surface-800 mb-4">
                  Skills & Expertise
                </h2>

                {/* Current Skills */}
                <div>
                  <h3 className="font-medium text-surface-800 mb-3">Your Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skills.map((skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-primary/70 hover:text-primary transition-colors"
                        >
                          <ApperIcon name="X" className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Add New Skill */}
                <div>
                  <h3 className="font-medium text-surface-800 mb-3">Add New Skill</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      placeholder="Enter a skill"
                      className="flex-1 px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-90 transition-all"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Resume Section */}
            {activeSection === 'resume' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-surface-800 mb-4">
                  Resume Management
                </h2>

                {/* Current Resume */}
                {user?.resumeUrl && (
                  <div className="border border-surface-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-error/10 p-3 rounded-full mr-4">
                          <ApperIcon name="FileText" className="w-6 h-6 text-error" />
                        </div>
                        <div>
                          <h3 className="font-medium text-surface-800">Current Resume</h3>
                          <p className="text-surface-600 text-sm">{user.resumeUrl}</p>
                        </div>
                      </div>
                      <button className="text-primary hover:text-secondary transition-colors">
                        <ApperIcon name="Download" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload New Resume */}
                <div className="border-2 border-dashed border-surface-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer block"
                  >
                    {resumeUploading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3 text-surface-600">Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <ApperIcon name="Upload" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-surface-800 mb-2">
                          Upload Your Resume
                        </h3>
                        <p className="text-surface-600 mb-4">
                          Drag and drop your PDF resume here, or click to browse
                        </p>
                        <div className="text-sm text-surface-500">
                          PDF files only, max 5MB
                        </div>
                      </>
                    )}
                  </label>
                </div>

                {/* Resume Tips */}
                <div className="bg-surface-50 rounded-lg p-4">
                  <h3 className="font-medium text-surface-800 mb-2">Resume Tips</h3>
                  <ul className="text-sm text-surface-600 space-y-1">
                    <li>• Keep your resume to 1-2 pages maximum</li>
                    <li>• Use clear, professional formatting</li>
                    <li>• Include relevant keywords from job descriptions</li>
                    <li>• Quantify your achievements with numbers</li>
                    <li>• Save as PDF to preserve formatting</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-surface-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:brightness-90 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile