# Mintlify starter kit

Select **Use this template** at the top of this repo to copy the Mintlify starter kit. The starter kit contains examples including:

- Guide pages
- Navigation
- Customizations
- API reference pages
- Components

## Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mint) to preview documentation changes locally. To install, use the following command:

```
npm i -g mint
```

Run the following command at the root of your documentation (where `docs.json` is located):

```
mint dev
```

## Publishing changes

To auto propagate changes from your repo to your deployment, install our Github App. Changes are deployed to production automatically after pushing to your default branch.

Install the GitHub App from your [dashboard](https://dashboard.mintlify.com/settings/organization/github-app).

## Troubleshooting

- If the dev environment isn't running: Run `mint update` to ensure you have the most recent version of the CLI.
- Page loads as a 404: Make sure you are running in a folder with `docs.json`.
