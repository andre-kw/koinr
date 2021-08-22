self.addEventListener('message', (event) => {
  const {payload} = event.data;

  console.log('heard something', event.data)

  self.postMessage({success: 'yessir'});
});