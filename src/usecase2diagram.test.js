const assert = require('assert')
const { usecase, step, Ok, ifElse } = require('@herbsjs/herbs')
const usecase2diagram = require('../src/usecase2diagram')

describe('Convert usecase to diagram', () => {

	const givenASimpleUsecase = () => {
		const AUsecase = usecase('A Usecase', {
			'Step 1': step(() => Ok()),
			'Step 2': step(() => Ok()),
			'Step 3': step(() => Ok()),
		})

		return AUsecase
	}

	const givenIfEleUsecase = () => {
		const AUsecase = usecase('A Usecase', {
			'Step 1': step(() => Ok()),
			'Step 2': step(() => Ok()),
			'Step 3': ifElse({
				'If Sub 3.1': step(() => Ok(true)),
				'Then Sub 3.2': step(() => Ok(true)),
				'Else Sub 3.3': step(() => Ok(true)),
			}),
			'Step 4': ifElse({
				'If Sub 4.1': step(() => Ok(true)),
				'Then Sub 4.2': step(() => Ok(true)),
				'Else Sub 4.3': step(() => Ok(true)),
			}),
		})

		return AUsecase
	}

	const givenMultiStepUsecase = () => {
		const AUsecase = usecase('A Usecase', {
			'Step 1': step(() => Ok()),
			'Step 2': step(() => Ok()),
			'Step 3': step({
				'Sub 3.1': step(() => Ok()),
				'Sub 3.2': step(() => Ok()),
				'Sub 3.3': step(() => Ok()),
			}),
			'Step 4': step({
				'Sub 4.1': step(() => Ok()),
				'Sub 4.2': step(() => Ok()),
				'Sub 4.3': step(() => Ok()),
			}),		
		})

		return AUsecase
	}

	it('should return a graph with all steps and relationship', async () => {
		// given

		const simpleUsecase = givenASimpleUsecase()
		await simpleUsecase.run()

		const usecase = {
			id: 'AUsecase',
			usecase: simpleUsecase
		}

		// when
		const result = usecase2diagram([usecase])

		// then
		assert.equal(result.length, 1)
		assert.equal(result[0].id, 'AUsecase')
		assert.equal(result[0].description, "A Usecase")
		assert.match(result[0].definition, /graph TD/)
		assert.match(result[0].definition, /(Step 1)/)
		assert.match(result[0].definition, /(Step 2)/)
		assert.match(result[0].definition, /(Step 3)/)
	})

	it('should return a graph with ifelse step', async () => {
		// given

		const simpleUsecase = givenIfEleUsecase()
		await simpleUsecase.run()

		const usecase = {
			id: 'AUsecase',
			usecase: simpleUsecase
		}

		// when
		const result = usecase2diagram([usecase])

		// then
		assert.equal(result.length, 1)
		assert.equal(result[0].id, 'AUsecase')
		assert.equal(result[0].description, "A Usecase")
		assert.match(result[0].definition, /graph TD/)
		assert.match(result[0].definition, /(Step 1)/)
		assert.match(result[0].definition, /(Step 2)/)
		assert.match(result[0].definition, /(Step 3)/)
		assert.match(result[0].definition, /{If Sub 3.1}/)
		assert.match(result[0].definition, /(Then Sub 3.2)/)
		assert.match(result[0].definition, /(Else Sub 3.3)/)
		assert.match(result[0].definition, /(Step 4)/)
		assert.match(result[0].definition, /{If Sub 4.1}/)
		assert.match(result[0].definition, /(Then Sub 4.2)/)
		assert.match(result[0].definition, /(Else Sub 4.3)/)
		assert.match(result[0].definition, /--> |If|/)
		assert.match(result[0].definition, /--> |Then|/)
		assert.match(result[0].definition, /--> |Else|/)
	})

	it('should return a graph with multi steps', async () => {
		// given

		const simpleUsecase = givenMultiStepUsecase()
		await simpleUsecase.run()

		const usecase = {
			id: 'AUsecase',
			usecase: simpleUsecase
		}

		// when
		const result = usecase2diagram([usecase])

		// then
		assert.equal(result.length, 1)
		assert.equal(result[0].id, 'AUsecase')
		assert.equal(result[0].description, "A Usecase")
		assert.match(result[0].definition, /graph TD/)
		assert.match(result[0].definition, /(Step 1)/)
		assert.match(result[0].definition, /(Step 2)/)
		assert.match(result[0].definition, /(Step 3)/)
		assert.match(result[0].definition, /subgraph/)
		assert.match(result[0].definition, /end/)
	})

	it('should throw an error when create a usecase with invalid parameters', async () => {
		// given

		const simpleUsecase = givenMultiStepUsecase()
		await simpleUsecase.run()

		const usecase = {
			id: null,
			usecase: simpleUsecase
		}

		// when
		const result = usecase2diagram([usecase])

		// then
		assert.equal(result.length, 1)
		assert.equal(result[0].id, 'AUsecase')
		assert.equal(result[0].description, "A Usecase")
		assert.match(result[0].definition, /graph TD/)
		assert.match(result[0].definition, /(Step 1)/)
		assert.match(result[0].definition, /(Step 2)/)
		assert.match(result[0].definition, /(Step 3)/)
		assert.match(result[0].definition, /subgraph/)
		assert.match(result[0].definition, /end/)
	})

})