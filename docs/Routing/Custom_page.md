# Custom page

Jito's routing function uses the `page()` method to register pages, but you can create a custom page method.
This allows for easy-to-understand page registration at a glance, for example

```js
page('/', embed('/index.js'))
page('/about', embed('/about.js'))
userPage('/user', embed('/user/index.js'))
userPage('/user/info', embed('/user/info.js'))
adminPage('/admin', embed('/admin/index.js'))
adminPage('/admin/setting', embed('/admin/setting.js'))
page('*', embed('/not_found.js'))
```

There are two ways to create a custom page method.

## The `section()` method

You can group pages by creating a new `page()` function with fixed middleware using the `section` method.

```js
let { section, page } = router

let userPage = section(userOnly)
userPage('/user', embed('/user/index.js'))
userPage('/user/info', embed('/user/info.js'))
```

## Child routers

The `page()` method returns a child router as a return value. The child router has exactly the same properties and methods as the parent router.

```js
export let adminRouter = page('/admin')
let { page: adminPage } = adminRouter
```

**NOTE:** Child routers will be untethered from the parent router if no pages are registered 60 seconds after they are created. The purpose is to prevent unnecessary router instances from occupying memory.

### `branch()` method

Do not use the child router's page switching methods (`push()`, `replace`, etc.). Instead, use the `branch()` method in the parent router middleware.

```js
let { page: adminPage } = page('/admin/:name', ({ params, branch }) => branch(params.name))
adminPage('dashboard', embed('/admin/dashboard.js'))
adminPage('settings', embed('/admin/settings.js'))
```

The child router becomes a means of further branching the branch.
At this time, it is possible to branch not only by URL path, but also by search query, data retrieved from the server, etc. Note, however, that wildcard and parameter routing are still enabled when routing by anything other than URL paths.

## Routing child components

Child routers also have a `panel` property. You can switch components by URL path for one part of the page while keeping the common parts of the page.
Call `embed()` before executing the `branch()` method as follows.

```js
export let adminRouter = page('/admin/:name', ({ params, branch, call }) => {
  call(embed('/layout.js'))
  return branch(params.name)
})
let { page: adminPage, embed: adminEmbed } = adminRouter
adminPage('dashboard', adminEmbed('/admin/dashboard.js'))
adminPage('settings', adminEmbed('/admin/settings.js'))
```

Surrounding it with blocks is one way.

```js
export let adminRouter = page('/admin/:name', ({ params, branch, call }) => {
  call(embed('/layout.js'))
  return branch(params.name)
})
{
  let { page, embed } = adminRouter
  page('dashboard', embed('/admin/dashboard.js'))
  page('settings', embed('/admin/settings.js'))
}
```
