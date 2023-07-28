const { StepDiagram } = require('./stepDiagram')
const { IfElseDiagram } = require('./ifElseDiagram')

function stepBuilder(step, options) {
    if (IfElseDiagram.check(step)) return new IfElseDiagram(step, options)
    else return new StepDiagram(step, options)
}

class UsecaseDiagram {

    constructor(usecase, options) {
        this.usecase = usecase
        this.options = Object.assign({ stepBuilder, main: true }, options)
        this.mainStep = stepBuilder(this.usecase, this.options)
    }

    draw() {
        const { body } = this.mainStep.draw()
        return body
    }
}

module.exports = { UsecaseDiagram }