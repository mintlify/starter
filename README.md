# Mintlify Starter Kit 💼
Get started by using this repository as a template, or by [clicking here](https://github.com/new?template_name=starter&template_owner=mintlify)

The starter kit contains examples including:
- Guide pages
- Navigation
- Customizations
- API Reference pages
- Use of popular components

### Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command:
```
npm i -g mintlify
```

To see your changes live, run the following command at the root of your documentation project (where mint.json is)
```
mintlify dev
```
> 💡 Tip: If you need to specify a specific port to run Mintlify on, try something like `mintlify dev --port 3333`

### Publishing Changes

Install our [GitHub App](https://github.com/apps/mintlify) to automatically propagate changes from your repo to your deployment.
Changes will be deployed to production automatically after pushing to the default branch. Find your custom app install link in your [Mintlify Dashboard](https://dashboard.mintlify.com/). 

### Troubleshooting

#### I can't use `mintlify dev`! 🐛
Run `mintlify install` to re-install your dependencies.
> 💡 Tip: If that doesn't work, reach out to our Support Team or create a GitHub Issue

#### Mintlify shows Error 404?! 🚫
The command `mintlify dev` can only be used on a Mintlify project.
> 💡 Tip: Make sure you have run the command at the root of your project structure, in the same place where your `mint.json` file should be located.
