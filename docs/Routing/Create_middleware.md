# How to create middleware

Middleware is a function that takes a context as its first argument.

The context contains several methods. The methods can be used to redirect pages that require authentication or redirection.

```js
let middleware = ({ next, redirect, through, branch, call, block}) => {
  ...
}
```

When creating middleware, any method other than `call()` should be executed only once.

The Jito router does not guarantee the behavior when multiple methods are executed multiple times.

## `next()`

```js
let middleware1 = ({ next }) => next({ name: 'Jito' }, { id: 'jito' })
let middleware2 = ({ props, query }) => console.log(props.name, query.id)
page('/p', middleware1, middleware2)

replace('/p', { name: 'Jito' }, { id: 'jito' }) // Output: Jito jito 
```

If you pass nothing, or pass `null` or `undefined` to the `next()` method, the same `props` and `query` passed to your own middleware will be passed to the next middleware.

```js
let middleware1 = ({ next }) => next()
let middleware2 = ({ props, query }) => console.log(props.name, query.id)
page('/p', middleware1, middleware2)

replace('/p', { name: 'jito' }, { id: 'jito' }) // Output: jito jito 
```

If you want to erase a property that crosses over to the next middleware, pass an empty object.

```js
let middleware1 = ({ next }) => next(null, {})
let middleware2 = ({ props, query }) => console.log(props.name, query.id)
page('/p', middleware1, middleware2)

replace('/p', { name: 'Jito' }, { id: 'jito' }) // Output: undefined jito 
```

## `redirect()`

The `redirect()` method interrupts the routing and starts over with a new URL path, `props` and `query`.

For example, use it to redirect an unauthenticated user to the login page.

```js
let userOnly = ({ pathname, next, redirect }) => {
  if (isAuthorized) {
    return next()
  } else {
    return redirect('login', null, { redirect_url: pahtname })
  }
}
page('/login', embed('/login.js'))
page('/user/info', userOnly, embed('/user/info.js'))
```

## `through()`

The `through()` method interrupts routing and resumes routing at the next matching URL pattern page.

It can be used, for example, to validate a URL and display NotFound if there is no match.

```js
let validate = ({ params, next, through }) => {
  if (Number(params.id) > 0) {
    return next()
  } else {
    return through()
  }
}
page('/news/:id', validate, embed('/news/id.js'))
page('*', embed('/not_found.js'))
```

## `branch()`

The `branch()` method suspends routing and resumes routing at the child router.
See the custom page for details.

## `call()`

The `call()` method is the only method that may be executed any number of times. It executes the middleware specified as its first argument. When it executes, it passes the same context as itself to the middleware.
It returns a Promise that waits for the middleware to complete.

```js
let middleware = async ({ call }) => {
  await call(embed('/file.js'))
}
```

## `block()`

The `block()` method interrupts routing. Because it aborts, the URL is not rewritten.
If you specify middleware as the first argument, it is executed in the same way as `call()`.

```js
let userOnly = async ({ next, block }) => {
  if (isAuthorized) {
    return next()
  } else {
    return block(embed('/no_user.js')
  }
}

page('/', userOnly, embed('/top.js'))
```

# Next

18. [Custom page](./Custom_page.md)