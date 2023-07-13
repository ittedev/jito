# Tutorial

This tutorial explains how to start using Jito so that it can be used by many people.

## What can Jito do for you?

First, let us explain what you can do with Jito.

1. With Jito, you can freely embed your original content into existing websites.
2. Its original contents can be easily understood with simple HTML-like syntax.
3. The original content is not affected by the existence of JS or CSS in the existing website
4. It is possible to create dynamic content that changes its display according to JavaScript data
5. You can also create SPA (Single Page Application).

## Create a HTML file

First, let's create one folder in any location and create an HTML file in it.
When you open it in your browser, you will see Hello World in red text.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    .red {
      color: red;
    }
  </style>
</head>
<body>
  <h1 class="red">Hello World</h1>
</body>
</html>
```

## Introducing Jito

Now we will write Jito code in a JavaScript file to intervene in the HTML file we have just created.

```js
import { mount } from 'https://cdn.jsdelivr.net/gh/ittedev/jito/jito.js'

mount(document.body, `
<style>
  .blue {
    color: blue;
  }
</style>
<h1 class="red">Hello Jito</h1>
`)
```

The `mount()` function replaces the element specified in the first argument with the template written in the second argument. Here, `document.body` is replaced, so the whole page is overwritten, but it is also possible to replace a part of the document.

Even if you overwrite, the contents of `document.body` will not disappear because Jito uses the Shadow DOM. It still exists in the DOM. The content of `document.body` still exists, but what is displayed on the screen is the template created by Jito.

If you load app.js from the HTML file, the red text Hello World will change to blue text Hello Jito.

The `type="module"` is required to load the app.js.

```html
 <!DOCTYPE html>
 <html>
 <head>
   <meta charset="UTF-8">
   <style>
     .red {
       color: red;
     }
   </style>
 </head>
 <body>
   <h1 class="red">Hello World</h1>
   <script type="module" src="./app.js"></script>
 </body>
 </html>
```

If you are viewing a local file directly in your browser, it may not load due to browser security.
In that case, try embedding the code directly.

```html
 <!DOCTYPE html>
 <html>
 <head>
   <meta charset="UTF-8">
   <style>
     .red {
       color: red;
     }
   </style>
 </head>
 <body>
   <h1 class="red">Hello World</h1>
   <script type="module">
     import { mount } from 'https://cdn.jsdelivr.net/gh/ittedev/jito/jito.js'

     mount(document.body, `
     <style>
       .blue {
         color: blue;
       }
     </style>
     <h1 class="blue">Hello Jito</h1>
     `)
   </script>
 </body>
 </html>
```

## Display data

Display numerical values or character strings.

```js
import { mount } from 'https://cdn.jsdelivr.net/gh/ittedev/jito/jito.js'

let data = {
  name: 'Jito'
}

mount(document.body, `
  <h1>Hello {| name |}</h1>
`, data)
```

In addition to displaying data, various displays such as if and for are possible. See [Template Syntax](./Template.md)

## Change the display as data changes

By using the `watch()` function to monitor the state, you can change the display as the state changes.
In the following example, the display first shows Hello World and then changes to Hello Jito one second later.

```js
import { watch, mount } from 'https://cdn.jsdelivr.net/gh/ittedev/jito/jito.js'

let state = watch({
  name: 'World'
})

setTimeout(() => {
  state.name = 'Jito'
}, 1000)

mount(document.body, `
  <h1>Hello {| name |}</h1>
`, data)
```


# Components

## Create components

You can use the `compact()` function to create reusable components.

```js
import { compact, mount } from 'https://cdn.jsdelivr.net/gh/ittedev/jito/jito.js'

let component = compact(`Hello Jito`)

mount(document.body, `
  <component />
  <component />
`, { component })
```

## Initialize a component when it is used

The `compact()` function takes an initialization function as its second argument. The initialization function is executed only once when the component is used.
Variables specified in the return value of the initialization function can be used in the template.

This allows you to use closed variables only within the component.

```js:component.js
import { compact, mount } from 'https://cdn.jsdelivr.net/gh/ittedev/jito/jito.js'

let component = compact(`Hello {| name |}`, ({ watch }) => {
  let state = watch({
    name: 'Jito'
  })
  return state;
})

mount(document.body, component)
```

# Welcome to Jito

Each chapter explains how to use Jito in more detail. If you have any questions, please feel free to read them.

You can also ask questions, make requests, and report bugs in the Issues section.

# Next

5. [Event Handling](./Event_handling.md)