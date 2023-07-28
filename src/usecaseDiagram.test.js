const assert = require('assert')
const { usecase, step, Ok, ifElse } = require('@herbsjs/herbs')
const { UsecaseDiagram } = require('../src/usecaseDiagram')

describe('Convert usecase to diagram', () => {

    const givenASimpleUsecase = () => {
        return usecase('A Usecase', {
            'Step 1': step(() => Ok()),
            'Step 2': step(() => Ok()),
            'Step 3': step(() => Ok()),
        })
    }

    const givenMultiStepUsecase = () => {
        return usecase('A Usecase', {
            'Step 1': step(() => Ok()),
            'Step 2': step(() => Ok()),
            'Step 3': step({
                'Sub 3.1': step(() => Ok()),
                'Sub 3.2': step(() => Ok()),
                'Sub 3.3': step(() => Ok()),
            }),
            'Step 4': step({
                'Sub 4.1': step({
                    'Sub 4.1.1': step({
                        'Sub 4.1.1.1': step(() => Ok()),
                        'Sub 4.1.1.2': step({
                            'Sub 4.1.1.2.1': step(() => Ok()),
                        }),
                        'Sub 4.1.1.3': step(() => Ok()),
                    }),
                    'Sub 4.1.2': step(() => Ok()),
                    'Sub 4.1.3': step({
                        'Sub 4.1.3.1': step(() => Ok()),
                    }),
                }),
                'Sub 4.2': step(() => Ok()),
                'Sub 4.3': step(() => Ok()),
            }),
            'Step 5': step(() => Ok()),
        })
    }

    const givenIfElseUsecase = () => {
        return usecase('A Usecase', {
            'Step 1': step(() => Ok()),
            'Step 2': step(() => Ok()),
            'Step 3': ifElse({
                'If Sub 3.1': step(() => Ok()),
                'Then Sub 3.2': step(() => Ok()),
                'Else Sub 3.3': step(() => Ok()),
            }),
            'Step 4': ifElse({
                'If Sub 4.1': step(() => Ok()),
                'Then Sub 4.2': step(() => Ok()),
                'Else Sub 4.3': step(() => Ok()),
            }),
        })
    }

    const givenIfElseUsecaseWithSubsteps = () => {
        return usecase('A Usecase', {
            'Step 1': step(() => Ok()),
            'Step 2': step(() => Ok()),
            'Step 3': ifElse({
                'If Sub 3.1': step(() => Ok()),
                'Then Sub 3.2': step(() => Ok()),
                'Else Sub 3.3': step(() => Ok()),
            }),
            'Step 4 - If': ifElse({
                'If Sub 4.1': step({
                    'Sub 4.1.1': step({
                        'Sub 4.1.1.1': step(() => Ok()),
                    }),
                    'Sub 4.1.2': step(() => Ok()),
                    'Sub 4.1.3': step(() => Ok()),
                }),
                'Then Sub 4.2': step(() => Ok()),
                'Else Sub 4.3': step(() => Ok()),
            }),
            'Step 5 - Then': ifElse({
                'If Sub 5.1': step(() => Ok()),
                'Then Sub 5.2': step({
                    'Sub 5.2.1': step(() => Ok()),
                    'Sub 5.2.2': step({
                        'Sub 5.2.2.1': step(() => Ok()),
                    }),
                    'Sub 5.2.3': step(() => Ok()),
                }),
                'Else Sub 5.3': step(() => Ok()),
            }),
            'Step 6 - Else': ifElse({
                'If Sub 6.1': step(() => Ok()),
                'Then Sub 6.2': step(() => Ok()),
                'Else Sub 6.3': step({
                    'Sub 6.3.1': step(() => Ok()),
                    'Sub 6.3.2': step({
                        'Sub 6.3.2.1': step(() => Ok()),
                    }),
                    'Sub 6.3.3': step(() => Ok()),
                }),
            }),
        })
    }

    describe('A simple use case', async () => {
        it('should return a graph with all steps', async () => {
            // given
            const simpleUsecase = givenASimpleUsecase()
            const hashFunc = (data, len) => 'hash'
            // when
            const diagram = new UsecaseDiagram(simpleUsecase.doc(), { hashFunc })
            const result = diagram.draw()

            // then
            assert.deepStrictEqual(result, `graph TD
Step1-hash["\`Step 1\`"]
Step2-hash["\`Step 2\`"]
Step3-hash["\`Step 3\`"]
Step1-hash --> Step2-hash
Step2-hash --> Step3-hash`)
        })
    })

    describe('A use case with multiple steps and substeps', async () => {
        it('should return a graph with all steps', async () => {
            // given
            const multiStepUsecase = givenMultiStepUsecase()
            const hashFunc = (data, len) => 'hash'
            // when
            const diagram = new UsecaseDiagram(multiStepUsecase.doc(), { hashFunc })
            const result = diagram.draw()

            // then
            assert.deepStrictEqual(result, `graph TD
Step1-hash["\`Step 1\`"]
Step2-hash["\`Step 2\`"]
subgraph Step3-hash [Step 3]
Sub31-hash["\`Sub 3.1\`"]
Sub32-hash["\`Sub 3.2\`"]
Sub33-hash["\`Sub 3.3\`"]
Sub31-hash --> Sub32-hash
Sub32-hash --> Sub33-hash
end
subgraph Step4-hash [Step 4]
subgraph Sub41-hash [Sub 4.1]
subgraph Sub411-hash [Sub 4.1.1]
Sub4111-hash["\`Sub 4.1.1.1\`"]
subgraph Sub4112-hash [Sub 4.1.1.2]
Sub41121-hash["\`Sub 4.1.1.2.1\`"]

end
Sub4113-hash["\`Sub 4.1.1.3\`"]
Sub4111-hash --> Sub4112-hash
Sub4112-hash --> Sub4113-hash
end
Sub412-hash["\`Sub 4.1.2\`"]
subgraph Sub413-hash [Sub 4.1.3]
Sub4131-hash["\`Sub 4.1.3.1\`"]

end
Sub411-hash --> Sub412-hash
Sub412-hash --> Sub413-hash
end
Sub42-hash["\`Sub 4.2\`"]
Sub43-hash["\`Sub 4.3\`"]
Sub41-hash --> Sub42-hash
Sub42-hash --> Sub43-hash
end
Step5-hash["\`Step 5\`"]
Step1-hash --> Step2-hash
Step2-hash --> Step3-hash
Step3-hash --> Step4-hash
Step4-hash --> Step5-hash`)
        })
    })

    describe('A use case with if step', async () => {
        it('should return a graph with all steps', async () => { 
            // given
            const ifElseUsecase = givenIfElseUsecase()
            const hashFunc = (data, len) => 'hash'
            // when
            const diagram = new UsecaseDiagram(ifElseUsecase.doc(), { hashFunc })
            const result = diagram.draw()

            // then
            assert.deepStrictEqual(result, `graph TD
Step1-hash["\`Step 1\`"]
Step2-hash["\`Step 2\`"]
subgraph Step3-hash [Step 3]
        IfSub31-hash{{"\`If Sub 3.1\`"}}
        ThenSub32-hash["\`Then Sub 3.2\`"]
        ElseSub33-hash["\`Else Sub 3.3\`"]
        IfSub31-hash -- TRUE --> ThenSub32-hash
        IfSub31-hash -. FALSE .-> ElseSub33-hash
    end
subgraph Step4-hash [Step 4]
        IfSub41-hash{{"\`If Sub 4.1\`"}}
        ThenSub42-hash["\`Then Sub 4.2\`"]
        ElseSub43-hash["\`Else Sub 4.3\`"]
        IfSub41-hash -- TRUE --> ThenSub42-hash
        IfSub41-hash -. FALSE .-> ElseSub43-hash
    end
Step1-hash --> Step2-hash
Step2-hash --> Step3-hash
Step3-hash --> Step4-hash`)
        })
    })

    describe('A use case with if step and multiple substeps', async () => {
        it('should return a graph with all steps', async () => { 
            // given
            const ifElseUsecaseWithSubsteps = givenIfElseUsecaseWithSubsteps()
            const hashFunc = (data, len) => 'hash'
            // when
            const diagram = new UsecaseDiagram(ifElseUsecaseWithSubsteps.doc(), { hashFunc })
            const result = diagram.draw()

            // then
            assert.deepStrictEqual(result, `graph TD
Step1-hash["\`Step 1\`"]
Step2-hash["\`Step 2\`"]
subgraph Step3-hash [Step 3]
        IfSub31-hash{{"\`If Sub 3.1\`"}}
        ThenSub32-hash["\`Then Sub 3.2\`"]
        ElseSub33-hash["\`Else Sub 3.3\`"]
        IfSub31-hash -- TRUE --> ThenSub32-hash
        IfSub31-hash -. FALSE .-> ElseSub33-hash
    end
subgraph Step4If-hash [Step 4 - If]
        subgraph IfSub41-hash [If Sub 4.1]
subgraph Sub411-hash [Sub 4.1.1]
Sub4111-hash["\`Sub 4.1.1.1\`"]

end
Sub412-hash["\`Sub 4.1.2\`"]
Sub413-hash["\`Sub 4.1.3\`"]
Sub411-hash --> Sub412-hash
Sub412-hash --> Sub413-hash
end
        ThenSub42-hash["\`Then Sub 4.2\`"]
        ElseSub43-hash["\`Else Sub 4.3\`"]
        IfSub41-hash -- TRUE --> ThenSub42-hash
        IfSub41-hash -. FALSE .-> ElseSub43-hash
    end
subgraph Step5Then-hash [Step 5 - Then]
        IfSub51-hash{{"\`If Sub 5.1\`"}}
        subgraph ThenSub52-hash [Then Sub 5.2]
Sub521-hash["\`Sub 5.2.1\`"]
subgraph Sub522-hash [Sub 5.2.2]
Sub5221-hash["\`Sub 5.2.2.1\`"]

end
Sub523-hash["\`Sub 5.2.3\`"]
Sub521-hash --> Sub522-hash
Sub522-hash --> Sub523-hash
end
        ElseSub53-hash["\`Else Sub 5.3\`"]
        IfSub51-hash -- TRUE --> ThenSub52-hash
        IfSub51-hash -. FALSE .-> ElseSub53-hash
    end
subgraph Step6Else-hash [Step 6 - Else]
        IfSub61-hash{{"\`If Sub 6.1\`"}}
        ThenSub62-hash["\`Then Sub 6.2\`"]
        subgraph ElseSub63-hash [Else Sub 6.3]
Sub631-hash["\`Sub 6.3.1\`"]
subgraph Sub632-hash [Sub 6.3.2]
Sub6321-hash["\`Sub 6.3.2.1\`"]

end
Sub633-hash["\`Sub 6.3.3\`"]
Sub631-hash --> Sub632-hash
Sub632-hash --> Sub633-hash
end
        IfSub61-hash -- TRUE --> ThenSub62-hash
        IfSub61-hash -. FALSE .-> ElseSub63-hash
    end
Step1-hash --> Step2-hash
Step2-hash --> Step3-hash
Step3-hash --> Step4If-hash
Step4If-hash --> Step5Then-hash
Step5Then-hash --> Step6Else-hash`)
        })
    })

})