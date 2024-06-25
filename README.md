# Mintlify Starter Kit

Click on `Use this template` to copy the Mintlify starter kit. The starter kit contains examples including

- Guide pages
- Navigation
- Customizations
- API Reference pages
- Use of popular components

### Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command

```
npm i -g mintlify
```

```
yarn global add mintlify
```

```
pnpm add -g mintlify
```

Run the following command at the root of your documentation (where mint.json is)

```
mintlify dev
```

Alternatively, you can use a run script if you don't want to install Mintlify globally.

```
npx mintlify dev
```

```
yarn dlx mintlify dev
```

```
pnpm dlx mintlify dev
```

Note:
> _Yarn's "dlx" run script requires yarn version >2. See [here](https://yarnpkg.com/cli/dlx) for more information._

### Publishing Changes

Install our Github App to auto propagate changes from your repo to your deployment. Changes will be deployed to production automatically after pushing to the default branch. Find the link to install on your dashboard.

#### Troubleshooting

- Mintlify dev isn't running - Run `mintlify install` it'll re-install dependencies.
- Page loads as a 404 - Make sure you are running in a folder with `mint.json`
