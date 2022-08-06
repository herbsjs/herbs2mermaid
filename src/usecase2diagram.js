const { checker } = require("@herbsjs/herbs")
const { Steps2Diagram } = require("./steps2Diagram")
const { StepsRelationship } = require("./stepsRelationship")

const injection = {
    
}

class Usecase2Diagram {
    constructor({ id, usecase }) {
        if (checker.isEmpty(usecase) || checker.isEmpty(id)) throw new Error("Usecase2Diagram: id and usecase are required")
        this.id = id
        this.usecase = usecase
        this.steps = Object.entries(this.usecase._mainStep._body)
        this.step2diagram = new Steps2Diagram(this.steps)
        this.stepRelationship = new StepsRelationship(this.steps)

    }

    getFlowChart() {
        const definition = this.usecase2FlowChart()
        return { id: this.id, description: this.usecase.description, definition }
    }

    usecase2FlowChart() {
        this.step2diagram.steps2FlowChart(`([*])`, `(*)`)
        this.stepRelationship.stepsRelationship(this.step2diagram.getChartSteps())

        let flowChart = `graph TD
            ${this.step2diagram.getClassDiagramString()}           
            ${this.stepRelationship.getRelationshipString()}
            ${this.stepRelationship.getMultistepsRelationshipString()}
        `
        return flowChart
    }
}

module.exports = (usecases) => {
    const toDiagram = (usecase) =>
        new Usecase2Diagram(usecase)
            .getFlowChart()

    return usecases.map(toDiagram)
}