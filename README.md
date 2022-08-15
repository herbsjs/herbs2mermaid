 <p align='center'><img src='https://avatars3.githubusercontent.com/u/60399865' height='220'></p>

![CI build](https://github.com/herbsjs/herbs2mermaid/workflows/CI%20build/badge.svg) [![codecov](https://codecov.io/gh/herbsjs/herbs2mermaid/branch/main/graph/badge.svg)](https://codecov.io/gh/herbsjs/herbs2mermaid)

# herbs2mermaid

With Herbs2mermaid you can generate Mermaid Class Diagram or Flow Chat easely. 

### Installing
```
    $ npm install @herbsjs/herbs2mermaid
```

### Functioning 

To use the herbs2mermaid you must given a list of usecases or entities to generate class diagram or flow chart. 

### Using 

The quickest way to use the herbs2mermaid is to install this packages in your project and use the functions bellow:

`usecase2diagram`: - Generate flow chart to a list of usecases

`entity2diagram`: - Generate class diagram to a list of entities

In your app or server project, import the herbs2mermaid functions

```javascript

const { usecase2diagram, entity2diagram } = require('@herbsjs/herbs2mermaid')


```

And call the shelf into you prefered rest route

```javascript

const classDiagram = entity2diagram(entities)
console.log(classDiagram)


const usecasesFlowChart = usecase2diagram(usecases)
console.log(usecasesFlowChart)

```

If your project has a `readme.md`, this content should be shown at the beginning of the project. If you want to use a custom readme, you can specify on startup:

```javascript

const shelf = renderShelfHTML('Project Name', usecases(), entities, './custom-readme.md')

```


You can see the full functionality into the [TODO-LIST ON HERBS repository](https://github.com/herbsjs/todolist-on-herbs)

## TODO

- [ ] Complex scenarios with recursive IfElse Step
- [ ] Complex scenarios with recursive Multi Level Step
- [ ] Include options to render diagram to Vertical or Horizontal posistion

### Contribute
Come with us to make an awesome *herbs2mermaid*.

Now, if you do not have the technical knowledge and also have intended to help us, do not feel shy, [click here](https://github.com/herbsjs/herbs2mermaid/issues) to open an issue and collaborate their ideas, the contribution may be a criticism or a compliment (why not?)

If you would like to help contribute to this repository, please see [CONTRIBUTING](https://github.com/herbsjs/herbs2mermaid/blob/main/.github/CONTRIBUTING.md)

### License

**herbsshelf** is released under the
[MIT license](https://github.com/herbsjs/herbs2mermaid/blob/main/LICENSE)
