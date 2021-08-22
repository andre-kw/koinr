function useErrorHandler(err) {
  return (err) => console.error(`Caught error: ${err.message}`);
}

export default useErrorHandler;