<script lang="ts">
  // TODO: delete this component
  export let segment: string;
</script>

<nav>
  <ul>
    <li>
      <a aria-current={segment === undefined ? "page" : undefined} href=".">
        Home
      </a>
    </li>
    <li>
      <a
        aria-current={segment === "brackets" ? "page" : undefined}
        href="brackets"
      >
        Brackets
      </a>
    </li>
    <li>
      <a aria-current={segment === "test" ? "page" : undefined} href="test">
        Test controls
      </a>
    </li>
  </ul>
</nav>

<style>
  nav {
    border-bottom: 1px solid rgba(62, 62, 200, 0.1);
    font-weight: 300;
    padding: 0 1em;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: "";
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

  [aria-current] {
    position: relative;
    display: inline-block;
  }

  [aria-current]::after {
    position: absolute;
    content: "";
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgba(62, 62, 200, 1);
    display: block;
    bottom: -1px;
  }

  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
    color: rgb(50, 50, 150);
  }
</style>
