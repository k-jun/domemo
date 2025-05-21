# domemo

## run

```sh
PORT='8080' deno run --allow-net --allow-read --allow-env src/main.js
```

## test

```sh
deno test
```


## build

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/k-jun/domemo:latest --push .
```
