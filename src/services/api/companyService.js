import companiesData from '../mockData/companies.json'

class CompanyService {
  constructor() {
    this.companies = [...companiesData]
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.companies])
      }, 300)
    })
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const company = this.companies.find(company => company.id === id)
        if (company) {
          resolve({ ...company })
        } else {
          reject(new Error('Company not found'))
        }
      }, 300)
    })
  }

  async create(companyData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCompany = {
          id: Date.now().toString(),
          ...companyData,
          createdAt: new Date().toISOString()
        }
        this.companies.push(newCompany)
        resolve({ ...newCompany })
      }, 300)
    })
  }

  async update(id, companyData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.companies.findIndex(company => company.id === id)
        if (index !== -1) {
          this.companies[index] = { ...this.companies[index], ...companyData }
          resolve({ ...this.companies[index] })
        } else {
          reject(new Error('Company not found'))
        }
      }, 300)
    })
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.companies.findIndex(company => company.id === id)
        if (index !== -1) {
          this.companies.splice(index, 1)
          resolve({ success: true })
        } else {
          reject(new Error('Company not found'))
        }
      }, 300)
    })
  }

  async searchByName(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.companies.filter(company =>
          company.name.toLowerCase().includes(query.toLowerCase())
        )
        resolve([...filtered])
      }, 300)
    })
  }

  async getByIndustry(industry) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.companies.filter(company =>
          company.industry.toLowerCase() === industry.toLowerCase()
        )
        resolve([...filtered])
      }, 300)
    })
  }
}

export default new CompanyService()