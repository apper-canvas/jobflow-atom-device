import applicationsData from '../mockData/applications.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ApplicationService {
  constructor() {
    this.applications = [...applicationsData]
  }

  async getAll() {
    await delay(300)
    return [...this.applications]
  }

  async getById(id) {
    await delay(200)
    const application = this.applications.find(a => a.id === id)
    if (!application) {
      throw new Error('Application not found')
    }
    return { ...application }
  }

  async create(applicationData) {
    await delay(400)
    const newApplication = {
      id: Date.now().toString(),
      ...applicationData,
      appliedDate: applicationData.appliedDate || new Date().toISOString()
    }
    this.applications.push(newApplication)
    return { ...newApplication }
  }

  async update(id, updates) {
    await delay(350)
    const index = this.applications.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Application not found')
    }
    this.applications[index] = { ...this.applications[index], ...updates }
    return { ...this.applications[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.applications.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Application not found')
    }
    this.applications.splice(index, 1)
    return { success: true }
  }
}

export default new ApplicationService()