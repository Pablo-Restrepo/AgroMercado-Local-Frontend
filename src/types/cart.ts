export interface CartItem {
  id: string
  productId: number       // añadir ID numérico real
  name: string
  price: number
  unit: string
  image: string
  quantity: number
  location: string
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}