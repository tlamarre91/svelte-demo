<script lang="ts">
  /* import "bulma/css/bulma.css"; */ 
  import Nav from "@/components/Nav.svelte";
  export let segment: string;
</script>

<Nav {segment} />
<main>
  <slot />
</main>

<style lang="scss" global>
  @import "bulma/bulma.sass";
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
