export type Message = {
  id: string,
  type: 'info' | 'success' | 'error' | 'warning',
  bucket: string,
  text: string,
  duration: number //maybe implement autodelete or something
}
