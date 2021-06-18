export default function ({app, error, store}) {
  if (store.$auth.loggedIn) {
    return app.context.redirect(`/`);
  }
}
