const crypto = require('crypto')

function hashFunc(data = '', len) {
    return crypto
        .createHash("shake256", { outputLength: len })
        .update(data)
        .digest("hex")
}

class StepDiagram {

    constructor(step, options) {
        this.step = step
        this.options = options
        hashFunc = this.options.hashFunc || hashFunc
        const safeDesc = step?.description?.replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '')
        this.id = safeDesc + '-' + hashFunc(step.description, 4)
        this.isMain = this.options.main
        this.options.main = false
    }

    hasSubsteps() {
        return this.step.steps && this.step.steps.length > 0
    }

    draw() {
        const subgraph = this.drawSubgraph()
        const body = subgraph ?? `${this.id}["\`${this.step.description}\`"]`
        return { id: this.id, body }
    }

    drawSubgraph() {
        if (!this.hasSubsteps()) return null
        const steps = this.step.steps || []
        const bodies = []
        const connections = []
        let prevStep = null
        const stepBuilder = this.options.stepBuilder
        for (const step of steps) {
            const stepDiagram = stepBuilder(step, this.options)
            const currentStep = stepDiagram.draw()
            bodies.push(currentStep.body)
            if (prevStep) connections.push(`${prevStep.id} --> ${currentStep.id}`)
            prevStep = currentStep
        }
        const body = `${bodies.filter(d => d).join('\n')}\n${connections.filter(d => d).join('\n')}`
        let subgraph = ``
        if (this.isMain) subgraph += `graph TD\n${body}`
        else subgraph += `subgraph ${this.id} [${this.step.description}]\n${body}\nend`
        return subgraph
    }

}

module.exports = { StepDiagram }