<script lang="ts">
  /* import "bulma/css/bulma.css"; */
  import Nav from "@/components/Nav.svelte";
  import Container from "@/components/Container.svelte";
  export let segment: string;
</script>

<Nav {segment} />
<main>
  <section>
    <Container>
      <slot />
    </Container>
  </section>
</main>
<footer>
  <div>
    <a
      href="https://github.com/tlamarre91/svelte-demo"
      target="blank"
      rel="noreferrer"
    >
      github.com/tlamarre91/svelte-demo
    </a>
  </div>
</footer>

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

  footer {
    padding: 1rem;
    display: flex;
    justify-content: center;
    border-top: 1px solid rgba(62, 62, 200, 0.1);
  }
</style>
