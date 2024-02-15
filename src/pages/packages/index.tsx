
 function Packages() {
  const loading = false

  if (loading) {
    return (
      <main className={'styles.main'}>
        <h2>Discover Berat is coming soon . . .</h2>
        <div className={'styles.video'}>Loading</div>
      </main>
    )
  }

  return <main className={'styles.main'}>packages</main>
}
export default Packages