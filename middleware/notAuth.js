export default function({ app, store, redirect }) {
  console.log(" this is noauth");
  
  if (!store.state.auth.token) {
    return redirect(app.localePath('login'))
  }
}
