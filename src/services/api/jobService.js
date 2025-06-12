import jobsData from '../mockData/jobs.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class JobService {
  constructor() {
    this.jobs = [...jobsData]
  }

  async getAll() {
    await delay(300)
    return [...this.jobs]
  }

  async getById(id) {
    await delay(200)
    const job = this.jobs.find(j => j.id === id)
    if (!job) {
      throw new Error('Job not found')
    }
    return { ...job }
  }

  async create(jobData) {
    await delay(400)
    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      postedDate: new Date().toISOString()
    }
    this.jobs.push(newJob)
    return { ...newJob }
  }

  async update(id, updates) {
    await delay(350)
    const index = this.jobs.findIndex(j => j.id === id)
    if (index === -1) {
      throw new Error('Job not found')
    }
    this.jobs[index] = { ...this.jobs[index], ...updates }
    return { ...this.jobs[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.jobs.findIndex(j => j.id === id)
    if (index === -1) {
      throw new Error('Job not found')
    }
this.jobs.splice(index, 1)
    return { success: true }
  }

  async getRecommendations(userId = '1') {
    await delay(400)
    
    try {
      // Import user service to get user profile
      const { default: userService } = await import('./userService.js')
      const { default: savedJobService } = await import('./savedJobService.js')
      const { default: applicationService } = await import('./applicationService.js')
      
      const [user, savedJobs, applications] = await Promise.all([
        userService.getById(userId),
        savedJobService.getAll(),
        applicationService.getAll()
      ])
      
      // Get user preferences from profile
      const userSkills = user.skills || []
      const userLocation = user.location || ''
      const preferredJobTypes = user.preferredJobTypes || ['full-time']
      
      // Analyze saved jobs for preferences
      const savedJobIds = savedJobs.map(sj => sj.jobId)
      const savedJobsData = this.jobs.filter(job => savedJobIds.includes(job.id))
      
      // Analyze application history
      const appliedJobIds = applications.map(app => app.jobId)
      
      // Score jobs based on multiple factors
      const scoredJobs = this.jobs
        .filter(job => !appliedJobIds.includes(job.id)) // Exclude already applied jobs
        .map(job => {
          let score = 0
          
          // Skill matching (40% weight)
          if (job.requirements && userSkills.length > 0) {
            const matchingSkills = job.requirements.filter(req => 
              userSkills.some(skill => 
                skill.toLowerCase().includes(req.toLowerCase()) || 
                req.toLowerCase().includes(skill.toLowerCase())
              )
            ).length
            score += (matchingSkills / job.requirements.length) * 40
          }
          
          // Location preference (20% weight)
          if (userLocation && job.location.toLowerCase().includes(userLocation.toLowerCase())) {
            score += 20
          }
          
          // Job type preference (15% weight)
          if (preferredJobTypes.includes(job.type)) {
            score += 15
          }
          
          // Similar to saved jobs (15% weight)
          const similarityToSaved = savedJobsData.filter(savedJob => 
            savedJob.company === job.company || 
            savedJob.type === job.type ||
            (savedJob.requirements && job.requirements && 
             savedJob.requirements.some(req => job.requirements.includes(req)))
          ).length
          score += (similarityToSaved / Math.max(savedJobsData.length, 1)) * 15
          
          // Recency bonus (10% weight)
          const daysSincePosted = (new Date() - new Date(job.postedDate)) / (1000 * 60 * 60 * 24)
          score += Math.max(0, (7 - daysSincePosted) / 7) * 10
          
          return {
            ...job,
            recommendationScore: score
          }
        })
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, 4) // Return top 4 recommendations
      
      return [...scoredJobs]
    } catch (error) {
      console.error('Error generating recommendations:', error)
      // Fallback to recent jobs if recommendation fails
      const sortedJobs = this.jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
      return [...sortedJobs.slice(0, 4)]
    }
  }
}

export default new JobService()