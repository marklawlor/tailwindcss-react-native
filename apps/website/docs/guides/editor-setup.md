# Editor Setup

Please refer to the [documentation on the Tailwind CSS website](https://tailwindcss.com/docs/editor-setup) for more information.

## Custom ClassName props

`cssInterop`/`remapProps` allow you to create custom className props. You can follow the documentation of your chosen plugin to add this to the checked `classAttributes`.

Here's an example where we are using VS Code and custom component `cssInterop(Component, { headerClassName: 'headerStyle' })`:

```json
{
  (...)
  "tailwindCSS.classAttributes": [
    "class",
    "className",
    "headerClassName"
  ]
}
```
