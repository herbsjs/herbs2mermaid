const { StepDiagram } = require('./stepDiagram')

class IfElseDiagram extends StepDiagram {

    constructor(step, options) {
        super(step, options)
        const stepBuilder = this.options.stepBuilder
        this.ifDiagram = stepBuilder(step.if, options)
        this.thenDiagram = stepBuilder(step.then, options)
        this.elseDiagram = stepBuilder(step.else, options)
    }

    draw() {
        const id = this.id
        const body = this.drawSubgraph()
        return { id, body }
    }

    drawSubgraph() {
        const ifStep = this.ifDiagram.draw()
        const ifBody = this.ifDiagram.hasSubsteps() ? ifStep.body : `${ifStep.id}{{"\`${this.step.if.description}\`"}}`
        const thenStep = this.thenDiagram.draw()
        const thenBody = this.thenDiagram.hasSubsteps() ? thenStep.body : `${thenStep.id}["\`${this.step.then.description}\`"]`
        const elseStep = this.elseDiagram.draw()
        const elseBody = this.elseDiagram.hasSubsteps() ? elseStep.body : `${elseStep.id}["\`${this.step.else.description}\`"]`
        const subgraph = `subgraph ${this.id} [${this.step.description}]
        ${ifBody}
        ${thenBody}
        ${elseBody}
        ${ifStep.id} -- TRUE --> ${thenStep.id}
        ${ifStep.id} -. FALSE .-> ${elseStep.id}
    end`
        return subgraph
    }

    static check(step) {
        return step.type === 'if else'
    }
}

module.exports = { IfElseDiagram }