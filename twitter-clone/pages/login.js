export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
