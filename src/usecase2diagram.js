const { UsecaseDiagram } = require('./usecaseDiagram')

module.exports = (usecases) => {
    return usecases.map((usecase) => {
        const uc = usecase.usecase
        const diagram = new UsecaseDiagram(uc.doc())
        return { id: usecase.id, description: uc.description, definition: diagram.draw() }
    })
}