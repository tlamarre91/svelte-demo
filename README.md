# Elovate with Svelte
by Tom LaMarre

This is a proof-of-concept for my other project, Elovate. Instead of React with Next.js, it uses Svelte with Sapper, and instead of Firestore, it uses MongoDB. The only goal here is to provide a nice UI for generating simple tournament brackets and reporting results. (Elovate will have more features, such as publishing brackets and allowing other users to report results.)

### notes
- There's no auth! All data saved by the app is associated with a session ID. A user can only access data associated with their current session ID, so clearing your cookies will cause you to lose access to anything you've saved.
