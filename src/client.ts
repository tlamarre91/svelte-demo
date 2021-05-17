import * as sapper from "@sapper/app";

// Use `any` so tsserver doesn't complain that target isn't a `Node`.
const target: any = document.querySelector("#sapper");

sapper.start({
  target,
});
