export interface CartItem {
  id: string
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