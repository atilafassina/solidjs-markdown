# Markdown Note Taker

> 🚧 **WiP**: this code is part of a series of videos on SolidStart.

| Cover | Title |
| --- | --- | 
| [![Cover for "Server Actions powered Auth in Solid-Start with Xata and Zod"](https://i.ytimg.com/vi/v5Usqqax4xE/mqdefault.jpg)](https://www.youtube.com/watch?v=v5Usqqax4xE) |  Server Actions powered Auth in Solid-Start with Xata and Zod. |
| [![Cover for "Server Actions with SolidStart"](https://i.ytimg.com/vi/ueNUEJ4vxFQ/mqdefault.jpg)](https://www.youtube.com/watch?v=ueNUEJ4vxFQ) |  Server Actions with SolidStart. |
| [![Cover for "Absolute speed: SolidJS + Web-Workers"](https://i.ytimg.com/vi/Ll2zt2m5Z5A/mqdefault.jpg)](https://youtube.com/watch?v=Ll2zt2m5Z5A) |  Absolute speed: SolidJS + Web-Workers. |

## Setup

To have auth working, you will need a [Xata](https://xata.io) account and initialize a database:

```
pnpx @xata.io/cli@latest init schema=schema-template.json
```

This will create a database at Xata with the schema in the `json`, it will also add the `XATA_API_KEY` to your `.env` and create a `.xatarc` with your database url.

## Ready to go

Now it's a matter of installing rest of dependencies and running the dev server.

```
pnpm i && pnpm dev
```

## Deploy?

Soon. There is some refactoring happening at SolidStart right now which will affect the adapters, so let's wait.
